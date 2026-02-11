import React, { useMemo, useState } from 'react';
import {
  Affix,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  EnvironmentOutlined,
  GiftOutlined,
  HomeOutlined,
  StarOutlined,
  TagOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { hotelService } from '@/services/hotelService';
import type { HotelDraftRequest, HotelRoomType, HotelStatus } from '@/types/hotel';

import './index.css';

const { Title, Text } = Typography;

const starOptions = [5, 4, 3, 2, 1].map((value) => ({
  label: `${value} 星`,
  value,
}));

const roomTypeOptions = ['豪华大床房', '行政套房', '亲子房', '景观双床房', '商务大床房'];

const bedTypeOptions = ['大床', '双床', '榻榻米', '上下铺'];

const HotelEditPage: React.FC = () => {
  const [form] = Form.useForm();
  const allValues = Form.useWatch([], form);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const updateFormStatus = (_: any, allFields: any[]) => {
    setIsDirty(allFields.some((field) => field.touched));
    setHasErrors(allFields.some((field) => field.errors?.length));
  };

  const buildPayload = (values: any, status: HotelStatus): HotelDraftRequest => {
    const roomTypes: HotelRoomType[] = (values?.roomTypes || []).map((room: HotelRoomType) => ({
      name: room?.name || '',
      bedType: room?.bedType || '',
      area: Number(room?.area || 0),
      price: Number(room?.price || 0),
      stock: Number(room?.stock || 0),
    }));

    const openDate = values?.basic?.openDate ? dayjs(values.basic.openDate).format('YYYY-MM-DD') : '';

    return {
      name: values?.basic?.nameCn || '',
      description: values?.basic?.nameEn || '',
      address: values?.basic?.address || '',
      price: Number(values?.priceRange?.min || 0),
      basic: {
        nameCn: values?.basic?.nameCn || '',
        nameEn: values?.basic?.nameEn || '',
        star: Number(values?.basic?.star || 0),
        openDate,
        address: values?.basic?.address || '',
      },
      priceRange: {
        min: Number(values?.priceRange?.min || 0),
        max: Number(values?.priceRange?.max || 0),
      },
      roomTypes,
      nearby: values?.nearby,
      promotions: values?.promotions,
      status,
    };
  };

  const unwrapResponse = (response: any) => response?.data?.data ?? response?.data ?? response;

  const saveDraft = async (status: HotelStatus = 'draft') => {
    const values = await form.validateFields();
    const payload = buildPayload(values, status);

    if (draftId) {
      await hotelService.updateHotel(draftId, payload);
      return draftId;
    }

    const response = await hotelService.createHotel(payload);
    const created = unwrapResponse(response);
    const nextId = created?.hotelId ?? created?.id ?? null;
    if (nextId) {
      setDraftId(nextId);
    }
    return nextId;
  };

  const handleSaveDraft = async () => {
    if (!form.isFieldsTouched(true)) {
      message.info('暂无修改内容');
      return;
    }

    setSavingDraft(true);
    try {
      await saveDraft('draft');
      setIsDirty(false);
      setLastSavedAt(dayjs().format('YYYY-MM-DD HH:mm'));
      message.success('已保存酒店信息草稿');
    } catch (error: any) {
      if (error?.errorFields) {
        message.error('请完善必填信息');
      } else {
        message.error('保存草稿失败，请稍后再试');
      }
    } finally {
      setSavingDraft(false);
    }
  };

  const handleAuditSubmit = async () => {
    setSubmitting(true);
    try {
      const targetId = await saveDraft('pending');
      if (targetId) {
        await hotelService.updateHotelStatus(targetId, { status: 'pending' });
      }
      setIsDirty(false);
      setLastSavedAt(dayjs().format('YYYY-MM-DD HH:mm'));
      message.success('已提交审核');
    } catch (error: any) {
      if (error?.errorFields) {
        message.error('请完善必填信息');
      } else {
        message.error('提交审核失败，请稍后再试');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = useMemo(() => !savingDraft && !submitting && !hasErrors, [savingDraft, submitting, hasErrors]);
  const canSaveDraft = useMemo(
    () => isDirty && !savingDraft && !submitting && !hasErrors,
    [isDirty, savingDraft, submitting, hasErrors],
  );

  return (
    <div className="hotel-edit-page">
      <div className="page-hero">
        <div>
          <Title level={2} className="page-title">
            酒店信息录入 / 编辑
          </Title>
          <Text className="page-subtitle">完整填写酒店基础信息、房型价格与优惠策略，用于后台审核与展示。</Text>
        </div>
        <Tag color="gold" className="page-tag">
          审核前草稿可随时修改
        </Tag>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Form
            form={form}
            layout="vertical"
            className="hotel-form"
            onFieldsChange={updateFormStatus}
            initialValues={{
              basic: {
                nameCn: '易宿臻选酒店',
                nameEn: 'Ease Inn Premier',
                star: 5,
                openDate: dayjs('2022-06-18'),
                address: '上海市静安区共和新路1000号',
              },
              priceRange: {
                min: 520,
                max: 1880,
              },
              roomTypes: [
                {
                  name: '豪华大床房',
                  bedType: '大床',
                  area: 42,
                  price: 880,
                  stock: 18,
                },
              ],
              nearby: {
                attractions: ['上海自然博物馆'],
                transport: ['地铁1号线延长路站'],
                mall: ['大悦城'],
              },
              promotions: [
                {
                  title: '节日优惠',
                  type: '折扣',
                  value: 0.8,
                },
              ],
            }}
          >
            <Card
              className="form-card fade-up"
              title={
                <Space>
                  <HomeOutlined />
                  <span>酒店基础信息</span>
                </Space>
              }
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="酒店名称（中文）"
                    name={['basic', 'nameCn']}
                    rules={[{ required: true, message: '请输入酒店名称' }]}
                  >
                    <Input placeholder="如：易宿臻选酒店" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="酒店名称（英文）"
                    name={['basic', 'nameEn']}
                    rules={[{ required: true, message: '请输入酒店英文名' }]}
                  >
                    <Input placeholder="如：Ease Inn Premier" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="酒店星级"
                    name={['basic', 'star']}
                    rules={[{ required: true, message: '请选择星级' }]}
                  >
                    <Select options={starOptions} placeholder="选择星级" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="开业时间"
                    name={['basic', 'openDate']}
                    rules={[{ required: true, message: '请选择开业时间' }]}
                  >
                    <DatePicker className="full-width" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    label="酒店地址"
                    name={['basic', 'address']}
                    rules={[{ required: true, message: '请输入酒店地址' }]}
                  >
                    <Input.TextArea placeholder="省市区街道信息" rows={3} maxLength={200} showCount />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="酒店起订价"
                    name={['priceRange', 'min']}
                    rules={[
                      { required: true, message: '请输入起订价' },
                      { type: 'number', min: 0, message: '价格不能为负数' },
                      ({ getFieldValue }) => ({
                        validator: (_, value) => {
                          const maxValue = getFieldValue(['priceRange', 'max']);
                          if (value != null && maxValue != null && value > maxValue) {
                            return Promise.reject(new Error('起订价不能高于封顶价'));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <InputNumber className="full-width" prefix={<DollarOutlined />} min={0} step={50} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="酒店封顶价"
                    name={['priceRange', 'max']}
                    rules={[
                      { required: true, message: '请输入封顶价' },
                      { type: 'number', min: 0, message: '价格不能为负数' },
                      ({ getFieldValue }) => ({
                        validator: (_, value) => {
                          const minValue = getFieldValue(['priceRange', 'min']);
                          if (value != null && minValue != null && value < minValue) {
                            return Promise.reject(new Error('封顶价不能低于起订价'));
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <InputNumber className="full-width" prefix={<DollarOutlined />} min={0} step={50} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card
              className="form-card fade-up delay-1"
              title={
                <Space>
                  <StarOutlined />
                  <span>房型与价格</span>
                </Space>
              }
            >
              <Form.List
                name="roomTypes"
                rules={[
                  {
                    validator: async (_, value) => {
                      if (!value || value.length === 0) {
                        return Promise.reject(new Error('至少添加一个房型'));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <Space direction="vertical" className="full-width" size="large">
                    {fields.map((field) => (
                      <Card
                        key={field.key}
                        className="nested-card"
                        title={`房型 ${field.name + 1}`}
                        extra={
                          fields.length > 1 ? (
                            <Button type="link" onClick={() => remove(field.name)}>
                              删除
                            </Button>
                          ) : null
                        }
                      >
                        <Row gutter={16}>
                          <Col xs={24} md={12}>
                            <Form.Item
                              label="房型名称"
                              name={[field.name, 'name']}
                              rules={[{ required: true, message: '请输入房型名称' }]}
                            >
                              <Select
                                placeholder="选择或输入房型"
                                mode="tags"
                                options={roomTypeOptions.map((name) => ({
                                  value: name,
                                  label: name,
                                }))}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item
                              label="床型"
                              name={[field.name, 'bedType']}
                              rules={[{ required: true, message: '请选择床型' }]}
                            >
                              <Select
                                placeholder="选择床型"
                                options={bedTypeOptions.map((name) => ({
                                  value: name,
                                  label: name,
                                }))}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item
                              label="面积 (m²)"
                              name={[field.name, 'area']}
                              rules={[{ required: true, message: '请输入面积' }]}
                            >
                              <InputNumber className="full-width" min={10} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item
                              label="每晚价格"
                              name={[field.name, 'price']}
                              dependencies={[
                                ['priceRange', 'min'],
                                ['priceRange', 'max'],
                              ]}
                              rules={[
                                { required: true, message: '请输入价格' },
                                { type: 'number', min: 0, message: '价格不能为负数' },
                                ({ getFieldValue }) => ({
                                  validator: (_, value) => {
                                    if (value == null) {
                                      return Promise.resolve();
                                    }
                                    const minValue = getFieldValue(['priceRange', 'min']);
                                    const maxValue = getFieldValue(['priceRange', 'max']);
                                    if (minValue != null && value < minValue) {
                                      return Promise.reject(new Error('每晚价格不能低于起订价'));
                                    }
                                    if (maxValue != null && value > maxValue) {
                                      return Promise.reject(new Error('每晚价格不能高于封顶价'));
                                    }
                                    return Promise.resolve();
                                  },
                                }),
                              ]}
                            >
                              <InputNumber className="full-width" prefix={<DollarOutlined />} min={0} step={50} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item
                              label="可售间数"
                              name={[field.name, 'stock']}
                              rules={[{ required: true, message: '请输入可售间数' }]}
                            >
                              <InputNumber className="full-width" min={1} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    <Form.ErrorList errors={errors} />
                    <Button type="dashed" onClick={() => add()} block>
                      添加房型
                    </Button>
                  </Space>
                )}
              </Form.List>
            </Card>

            <Card
              className="form-card fade-up delay-2"
              title={
                <Space>
                  <EnvironmentOutlined />
                  <span>周边配套（选填）</span>
                </Space>
              }
            >
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label="热门景点" name={['nearby', 'attractions']}>
                    <Select mode="tags" placeholder="输入景点名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="交通枢纽" name={['nearby', 'transport']}>
                    <Select mode="tags" placeholder="输入站点/机场" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="商场" name={['nearby', 'mall']}>
                    <Select mode="tags" placeholder="输入商场名称" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card
              className="form-card fade-up delay-3"
              title={
                <Space>
                  <GiftOutlined />
                  <span>优惠策略（选填）</span>
                </Space>
              }
            >
              <Form.List name="promotions">
                {(fields, { add, remove }) => (
                  <Space direction="vertical" className="full-width" size="large">
                    {fields.map((field) => (
                      <Card
                        key={field.key}
                        className="nested-card"
                        title={`优惠方案 ${field.name + 1}`}
                        extra={
                          fields.length > 1 ? (
                            <Button type="link" onClick={() => remove(field.name)}>
                              删除
                            </Button>
                          ) : null
                        }
                      >
                        <Row gutter={16}>
                          <Col xs={24} md={10}>
                            <Form.Item
                              label="优惠标题"
                              name={[field.name, 'title']}
                              rules={[{ required: true, message: '请输入优惠标题' }]}
                            >
                              <Input placeholder="如：节日优惠" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={7}>
                            <Form.Item
                              label="优惠类型"
                              name={[field.name, 'type']}
                              rules={[{ required: true, message: '请选择类型' }]}
                            >
                              <Select
                                options={[
                                  { label: '折扣', value: '折扣' },
                                  { label: '满减', value: '满减' },
                                  { label: '套餐', value: '套餐' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={7}>
                            <Form.Item
                              label="优惠数值"
                              name={[field.name, 'value']}
                              rules={[{ required: true, message: '请输入优惠数值' }]}
                            >
                              <InputNumber className="full-width" min={0} step={0.1} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    <Button type="dashed" onClick={() => add()} block>
                      添加优惠方案
                    </Button>
                  </Space>
                )}
              </Form.List>
            </Card>

            <Divider />
            <Space size="middle">
              <Button type="primary" onClick={handleAuditSubmit} loading={submitting} disabled={!canSubmit}>
                提交审核
              </Button>
              <Button onClick={handleSaveDraft} loading={savingDraft} disabled={!canSaveDraft}>
                保存草稿
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  setIsDirty(false);
                  setHasErrors(false);
                }}
                disabled={savingDraft || submitting}
              >
                重置
              </Button>
            </Space>
          </Form>
        </Col>

        <Col xs={24} lg={8}>
          <Affix offsetTop={24}>
            <Card className="preview-card">
              <Space direction="vertical" size="middle" className="full-width">
                <div className="preview-header">
                  <Tag icon={<TagOutlined />} color="geekblue">
                    预览
                  </Tag>
                  <Text type="secondary">对外展示信息示意</Text>
                </div>

                <div className="preview-block">
                  <Title level={4} className="preview-title">
                    {allValues?.basic?.nameCn || '请输入酒店名称'}
                  </Title>
                  <Text type="secondary">{allValues?.basic?.nameEn || 'Hotel English Name'}</Text>
                  <div className="preview-stars">
                    {Array.from({ length: allValues?.basic?.star || 0 }).map((_, idx) => (
                      <StarOutlined key={idx} />
                    ))}
                  </div>
                </div>

                <div className="preview-block">
                  <Text className="preview-label">地址</Text>
                  <Text>{allValues?.basic?.address || '填写完整地址'}</Text>
                </div>

                <div className="preview-block">
                  <Text className="preview-label">参考价格</Text>
                  <div className="price-range">
                    <span>￥{allValues?.priceRange?.min || '--'}</span>
                    <span className="range-split">~</span>
                    <span>￥{allValues?.priceRange?.max || '--'}</span>
                  </div>
                </div>

                <div className="preview-block">
                  <Text className="preview-label">核心房型</Text>
                  <Space wrap>
                    {(allValues?.roomTypes || []).slice(0, 3).map((room: any, index: number) => (
                      <Tag key={`${room?.name || 'room'}-${index}`} color="cyan">
                        {room?.name || '房型'}
                      </Tag>
                    ))}
                  </Space>
                </div>

                <div className="preview-block">
                  <Text className="preview-label">优惠亮点</Text>
                  <Space wrap>
                    {(allValues?.promotions || []).slice(0, 2).map((promo: any, index: number) => (
                      <Tag key={`${promo?.title || 'promo'}-${index}`} color="magenta">
                        {promo?.title || '优惠'}
                      </Tag>
                    ))}
                  </Space>
                </div>

                <div className="preview-block">
                  <Text className="preview-label">草稿状态</Text>
                  <Space>
                    <Tag color={draftId ? 'gold' : 'default'}>{draftId ? `草稿 #${draftId}` : '未保存'}</Tag>
                    <Text type="secondary">{lastSavedAt ? `最近保存：${lastSavedAt}` : '尚未保存'}</Text>
                  </Space>
                </div>
              </Space>
            </Card>
          </Affix>
        </Col>
      </Row>
    </div>
  );
};

export default HotelEditPage;
