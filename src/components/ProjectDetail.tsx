'use client';
import {
  useGetProjectDetailQuery,
  useGetProjectStatusQuery,
  useGetSheetsQuery,
  useUpdateProjectStatusMutation,
  useDeleteSheetMutation,
} from '@/api/app_project/app_project';
import {
  AppstoreOutlined,
  PlusOutlined,
  SettingOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  message,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
  Tag,
  Popconfirm,
} from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddSheets from './AddSheets';
import { Option } from 'antd/es/mentions';

interface Sheet {
  id: string;
  name: string;
  data: any[];
}

interface ProjectDetail {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  user: string;
  team_members: string[];
}

const columns = [
  {
    title: 'Công việc',
    dataIndex: 'task',
    key: 'task',
  },
  {
    title: 'Người phụ trách',
    dataIndex: 'assignee',
    key: 'assignee',
  },
  {
    title: 'Tiến độ',
    dataIndex: 'progress',
    key: 'progress',
    render: (text: string) => <Tag color='blue'>{text}</Tag>,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (text: string) => (
      <Tag color={text === 'Done' ? 'green' : 'volcano'}>{text}</Tag>
    ),
  },
];

function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const projectId = Array.isArray(id) ? id[0] : id;
  const { data: sheetsData } = useGetSheetsQuery();
  const { data: statusData, refetch: refetchStatus } = useGetProjectStatusQuery({ projectId });
  const [updateProjectStatus] = useUpdateProjectStatusMutation();
  const [deleteSheet] = useDeleteSheetMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: project,
    error,
    isLoading,
  } = useGetProjectDetailQuery(projectId);

  const [sheets, setSheets] = useState<Sheet[]>([]);

  useEffect(() => {
    setSheets((prev) => {
      return sheetsData?.results.filter(
        (item: any) => String(projectId) === String(item.project)
      );
    });
  }, [sheetsData]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Công việc chung',
      children: <Table columns={columns} dataSource={[]} />,
    },
    ...(sheets?.map((sheet: Sheet) => ({
      key: sheet.id,
      label: sheet.name,
      children: (
        <div>
          <Table columns={columns} dataSource={sheet.data} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sheet này không?"
            onConfirm={() => handleDeleteSheet(sheet.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa Sheet
            </Button>
          </Popconfirm>
        </div>
      ),
    })) || []),
    {
      key: 'settings',
      label: <SettingOutlined />,
      children: <div>Cài đặt dự án</div>,
    },
  ];

  const addSheet = () => {
    setIsModalOpen(true);
  };

  const handleDeleteSheet = async (sheetId: string) => {
    try {
      await deleteSheet({ id: sheetId });
      message.success("Sheet đã được xóa.");
      setSheets((prev) => prev.filter((sheet) => sheet.id !== sheetId));
    } catch (error) {
      message.error("Xóa sheet thất bại.");
    }
  };

  const handleStatusChange = async (value: string) => {
    let color = "";
    if (value === "Completed") {
      color = "#dD427a";
    } else if (value === "In Progress") {
      color = "#FFA500";
    }

    try {
      await updateProjectStatus({ id: projectId, name: value, color, user: 1 });
      message.success("Trạng thái dự án đã được cập nhật.");
      refetchStatus(); // Refetch the status data to update the UI
    } catch (error) {
      message.error("Cập nhật trạng thái dự án thất bại.");
    }
  };

  if (isLoading)
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}
      >
        <Spin size='large' tip='Đang tải chi tiết dự án...' />
      </div>
    );

  if (error)
    return (
      <Alert
        message='Lỗi khi tải dự án'
        description='Không thể tải thông tin dự án. Vui lòng thử lại sau.'
        type='error'
        showIcon
        closable
        style={{ maxWidth: '800px', margin: '40px auto' }}
      />
    );

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto' }}>
      <Row gutter={24}>
        {/* Phần tabs và công việc */}
        <Col span={16}>
          <Tabs
            defaultActiveKey='1'
            items={items}
            tabBarExtraContent={
              <Button
                type='primary'
                icon={<PlusOutlined />}
                style={{ marginRight: '20px' }}
                onClick={addSheet}
              >
                Thêm Sheet
                <AddSheets
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  setSheets={setSheets}
                  projectId={projectId}
                />
              </Button>
            }
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
        </Col>

        {/* Phần thông tin dự án */}
        <Col span={8}>
          <Card
            title={
              <>
                <AppstoreOutlined /> Thông tin dự án
              </>
            }
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item label='Tên dự án'>
                {project?.name}
              </Descriptions.Item>
              <Descriptions.Item label='Thời gian'>
                {project?.start_date} - {project?.end_date}
              </Descriptions.Item>
              <Descriptions.Item label='Mô tả'>
                {project?.description}
              </Descriptions.Item>
              <Descriptions.Item label='Người tạo'>
                {project?.user}
              </Descriptions.Item>
              <Descriptions.Item label='Thành viên'>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {project?.team_members?.map((member: string) => (
                    <Tag key={member} color='blue'>
                      {member}
                    </Tag>
                  ))}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Select
                  value={statusData?.name}
                  onChange={handleStatusChange}
                  style={{ width: '100%' }}
                >
                  <Option value="Not Started">Not Started</Option>
                  <Option value="In Progress">In Progress</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProjectDetail;