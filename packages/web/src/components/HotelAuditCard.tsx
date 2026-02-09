import React from 'react';
import { Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { Hotel } from '@/types/hotel';

const { Text } = Typography;

interface HotelAuditCardProps {
  hotel: Hotel;
  onApprove: HotelAction;
  onReject: HotelAction;
}

// eslint-disable-next-line no-unused-vars
type HotelAction = (hotelId: number) => void;

const statusColorMap: Record<string, string> = {
  pending: 'gold',
  approved: 'green',
  rejected: 'red',
};

const HotelAuditCard: React.FC<HotelAuditCardProps> = ({ hotel, onApprove, onReject }) => {
  return (
    <Card title="酒店审核详情" bordered={false}>
      <Descriptions column={1} size="small">
        <Descriptions.Item label="酒店名称">{hotel.name}</Descriptions.Item>
        <Descriptions.Item label="酒店地址">{hotel.address}</Descriptions.Item>
        <Descriptions.Item label="酒店星级">{hotel.star ? `${hotel.star} 星` : '未填写'}</Descriptions.Item>
        <Descriptions.Item label="开业时间">{hotel.openDate || '未填写'}</Descriptions.Item>
        <Descriptions.Item label="价格区间">
          {hotel.priceRange ? `￥${hotel.priceRange.min} ~ ￥${hotel.priceRange.max}` : '未填写'}
        </Descriptions.Item>
        <Descriptions.Item label="房型">
          {hotel.roomTypes?.length ? hotel.roomTypes.join(' / ') : '未填写'}
        </Descriptions.Item>
        <Descriptions.Item label="当前状态">
          <Tag color={statusColorMap[hotel.status] || 'default'}>{hotel.status}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Text type="secondary">审核通过后将对外发布。</Text>

      <Space style={{ marginTop: 16 }}>
        <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => onApprove(hotel.hotelId)}>
          通过
        </Button>
        <Button danger icon={<CloseCircleOutlined />} onClick={() => onReject(hotel.hotelId)}>
          拒绝
        </Button>
      </Space>
    </Card>
  );
};

export default HotelAuditCard;
