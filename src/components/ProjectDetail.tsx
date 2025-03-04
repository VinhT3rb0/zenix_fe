'use client';
import {
  useDeleteSheetMutation,
  useDeleteTaskMutation,
  useGetAllProjectStatusesQuery,
  useGetProjectDetailQuery,
  useGetSheetsQuery,
  useGetTasksQuery,
  useUpdateProjectStatusMutation,
} from '@/api/app_project/app_project';
import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  message,
  Popconfirm,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
  Tag,
} from 'antd';
import { Option } from 'antd/es/mentions';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddSheets from './AddSheets';
import AddTasks from './AddTasks';

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

interface Status {
  id: string;
  name: string;
  color: string;
}

function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const projectId = Array.isArray(id) ? id[0] : id;
  const { data: sheetsData } = useGetSheetsQuery();
  const { data: statusData, refetch: refetchStatus } =
    useGetProjectDetailQuery(projectId);
  const [updateProjectStatus] = useUpdateProjectStatusMutation();
  const [deleteSheet] = useDeleteSheetMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddTasksModalOpen, setIsAddTasksModalOpen] = useState(false);
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [sheetsId, setSheetsId] = useState<string>('settings');
  const [tasksList, setTasksList] = useState<any[]>([]);
  const [deleteTask] = useDeleteTaskMutation();
  const { refetch: refetchTasks } = useGetTasksQuery();
  const { data: allStatusesData } = useGetAllProjectStatusesQuery();

  const {
    data: project,
    error,
    isLoading,
  } = useGetProjectDetailQuery(projectId);

  const { data: tasksData } = useGetTasksQuery();

  // Lấy danh sách sheets
  useEffect(() => {
    setSheets((prev) => {
      return sheetsData?.results.filter(
        (item: any) => String(projectId) === String(item.project)
      );
    });
  }, [sheetsData]);

  // Lấy danh sách tasks
  useEffect(() => {
    setTasksList(() => {
      return tasksData?.results.filter(
        (item: any) => String(sheetsId) === String(item.sheet)
      );
    });
  }, [sheetsId, tasksData]);

  // Xóa task
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask({ id: taskId });
      message.success('Task đã được xóa.');
      refetchTasks();
    } catch (error) {
      message.error('Xóa task thất bại.');
    }
    refetchTasks();
  };

  const columns = [
    {
      title: 'Công việc',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'assignees_names',
      key: 'assignees_names',
      render: (text: string[]) => {
        console.log(text);
        return text.map((assignee: any) => {
          return (
            <div>
              <p>{assignee}</p>
            </div>
          );
        });
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created',
      key: 'created',
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString('vi-VN');
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <h1>{text === null ? 'Đang tiến hành' : 'Chưa xong'}</h1>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type='primary' icon={<EditOutlined />}></Button>
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa task này không?'
            onConfirm={() => handleDeleteTask(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button type='text' danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  // Mục tabs trong project detail
  const items: TabsProps['items'] = [
    ...(sheets?.map((sheet: Sheet) => ({
      key: sheet.id,
      label: sheet.name,
      children: (
        <div>
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa sheet này không?'
            onConfirm={() => handleDeleteSheet(sheet.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button type='primary' danger icon={<DeleteOutlined />}>
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

  // Gọi modal thêm sheet
  const addSheet = () => {
    setIsModalOpen(true);
  };

  // Gọi modal thêm tasks
  const addTasks = () => {
    setIsAddTasksModalOpen(true);
  };

  // Xóa sheet
  const handleDeleteSheet = async (sheetId: string) => {
    try {
      await deleteSheet({ id: sheetId });
      message.success('Sheet đã được xóa.');
      setSheets((prev) => prev.filter((sheet) => sheet.id !== sheetId));
    } catch (error) {
      message.error('Xóa sheet thất bại.');
    }
  };

  // Cập nhật trạng thái dự án
  const handleStatusChange = async (value: string) => {
    let color = '';
    if (value === 'Completed') {
      color = '#dD427a';
    } else if (value === 'In Progress') {
      color = '#FFA500';
    }

    try {
      await updateProjectStatus({ id: projectId, status: value });
      message.success('Trạng thái dự án đã được cập nhật.');
      refetchStatus(); // Refetch the status data to update the UI
    } catch (error) {
      message.error('Cập nhật trạng thái dự án thất bại.');
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
            defaultActiveKey='settings'
            items={items}
            onChange={(key) => setSheetsId(key)}
            tabBarExtraContent={
              <>
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  style={{ marginRight: '20px' }}
                  onClick={addSheet}
                >
                  Thêm Sheet
                </Button>
                <AddSheets
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  setSheets={setSheets}
                  projectId={projectId}
                />
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  style={{ marginRight: '20px' }}
                  onClick={addTasks}
                >
                  Thêm tasks
                </Button>
                <AddTasks
                  isAddTasksModalOpen={isAddTasksModalOpen}
                  setIsAddTasksModalOpen={setIsAddTasksModalOpen}
                  sheetsId={sheetsId}
                  projectId={projectId}
                />
              </>
            }
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
        </Col>
        <Col span={16}>
          {sheetsId === 'settings' ? (
            <></>
          ) : (
            <Table columns={columns} dataSource={tasksList} />
          )}
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
              <Descriptions.Item label='Trạng thái'>
                <Select
                  value={statusData?.status_detail?.name}
                  placeholder='Chọn trạng thái dự án'
                  onChange={handleStatusChange}
                  style={{ width: '100%' }}
                >
                  {allStatusesData?.results.map((status: Status) => (
                    <Option key={status.id} value={status.id}>
                      {status.name}
                    </Option>
                  ))}
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
