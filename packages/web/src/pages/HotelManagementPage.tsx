import React, { useEffect, useState } from 'react';
import { Card, Table, Space, Button, Input, Select, Modal, message, Spin } from 'antd';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { hotelService } from '@/services/hotelService';
import { Hotel, HotelStatus } from '@/types/hotel';
import HotelAuditCard from '../components/HotelAuditCard';

const { Search } = Input;

const HotelManagementPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<HotelStatus | null>(null);

  const loadHotels = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const data = await hotelService.getHotels({
        page,
        size,
        search: searchText || undefined,
        status: statusFilter || undefined,
      });

      setHotels(data.content);
      setPagination({
        current: page,
        pageSize: size,
        total: data.totalElements,
      });
    } catch {
      message.error('加载酒店列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels(1, pagination.pageSize);
  }, [searchText, statusFilter]);

  const handleApprove = async (id: number) => {
    await hotelService.updateHotelStatus(id, { status: 'approved' });
    message.success('酒店审核通过，已发布');
    loadHotels(pagination.current, pagination.pageSize);
  };

  const handleReject = async (id: number) => {
    await hotelService.updateHotelStatus(id, { status: 'rejected' });
    message.success('酒店审核已拒绝');
    loadHotels(pagination.current, pagination.pageSize);
  };

  const columns: ColumnsType<Hotel> = [
    {
      title: '酒店ID',
      dataIndex: 'hotelId',
      width: 100,
    },
    {
      title: '酒店名称',
      dataIndex: 'name',
    },
    {
      title: '地址',
      dataIndex: 'address',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '操作',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => {
            setCurrentHotel(record);
            setModalVisible(true);
          }}
        >
          审核
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="酒店信息审核列表"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => loadHotels(pagination.current, pagination.pageSize)}>
              刷新
            </Button>

            <Select<HotelStatus>
              placeholder="审核状态"
              allowClear
              style={{ width: 150 }}
              onChange={(v) => setStatusFilter(v ?? null)}
              options={[
                { value: 'pending', label: '待审核' },
                { value: 'approved', label: '已发布' },
                { value: 'rejected', label: '审核拒绝' },
              ]}
            />

            <Search placeholder="搜索酒店名称 / 地址" onSearch={setSearchText} style={{ width: 260 }} />
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={hotels}
            rowKey="hotelId"
            pagination={{
              ...pagination,
              showTotal: (t) => `共 ${t} 条`,
            }}
            onChange={(p) => loadHotels(p.current!, p.pageSize!)}
            locale={{ emptyText: '暂无待审核酒店' }}
          />
        </Spin>
      </Card>

      <Modal open={modalVisible} footer={null} onCancel={() => setModalVisible(false)} width={600}>
        {currentHotel && <HotelAuditCard hotel={currentHotel} onApprove={handleApprove} onReject={handleReject} />}
      </Modal>
    </div>
  );
};

export default HotelManagementPage;
