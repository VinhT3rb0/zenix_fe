'use client';
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetAllProjectStatusesQuery,
} from '@/api/app_project/app_project';
import {
  Card,
  Col,
  Row,
  Spin,
  Alert,
  Typography,
  theme,
  Button,
  Tag,
} from 'antd';
import Link from 'next/link';
import { CalendarOutlined, ProjectOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { CSSProperties, useState, useEffect } from 'react';
import ProjectModal from './components/ProjectModal/page';

const { Title } = Typography;

interface Project {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  description?: string;
  status: string;
  status_detail: {
    id: number;
    name: string;
    color: string;
  };
}

interface Status {
  id: number;
  name: string;
  color: string;
  status_detail: {
    id: number;
    name: string;
    color: string;
  };
}

interface ProjectsResponse {
  results: Project[];
}

interface StatusesResponse {
  results: Status[];
}

function ProjectList() {
  const {
    token: { colorPrimary, colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data, error, isLoading } = useGetProjectsQuery<{
    data?: ProjectsResponse;
    error?: any;
    isLoading: boolean;
  }>();

  const { data: statusesData, isLoading: isStatusesLoading } =
    useGetAllProjectStatusesQuery<{
      data?: StatusesResponse;
      error?: any;
      isLoading: boolean;
    }>();

  console.log(statusesData);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const showModal = (project?: Project) => {
    setIsEditMode(!!project);
    setCurrentProject(project || null);
    setIsModalVisible(true);
  };

  const handleOk = async (values: any) => {
    try {
      if (isEditMode && currentProject) {
        await updateProject({ id: currentProject.id, ...values });
      } else {
        await createProject(values);
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject({ id });
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const formatDate = (dateString: string): string =>
    dayjs(dateString).format('DD/MM/YYYY');

  if (isLoading || isStatusesLoading)
    return (
      <div style={centerContainerStyle}>
        <Spin size='large' tip='Đang tải dự án...' />
      </div>
    );

  if (error)
    return (
      <div style={pagePaddingStyle}>
        <Alert
          message='Lỗi khi tải dữ liệu'
          description='Không thể tải danh sách dự án. Vui lòng thử lại sau.'
          type='error'
          showIcon
          closable
          style={alertStyle}
        />
      </div>
    );

  const projects = Array.isArray(data?.results) ? data.results : [];
  const projectStatuses = Array.isArray(statusesData?.results)
    ? statusesData.results
    : [];

  return (
    <div style={{ ...pagePaddingStyle, maxWidth: '1440px', margin: '0 auto' }}>
      <Title level={2} style={{ ...titleStyle, color: 'black' }}>
        <ProjectOutlined /> DANH SÁCH DỰ ÁN
      </Title>
      <Button
        type='primary'
        onClick={() => showModal()}
        style={{ marginBottom: '16px' }}
      >
        Thêm dự án
      </Button>

      {projects.length === 0 ? (
        <Alert
          message='Không có dự án'
          description='Hiện chưa có dự án nào được tạo. Hãy tạo dự án đầu tiên!'
          type='info'
          showIcon
          style={alertStyle}
        />
      ) : (
        <Row gutter={[24, 24]} justify='center'>
          {projects.map((project: Project) => {
            const projectStatus = projectStatuses.find(
              (status) => status.id === parseInt(project.id)
            );
            return (
              <Col key={project.id} xs={24} sm={12} lg={8} xl={6}>
                <Card
                  hoverable
                  style={{
                    ...cardStyle,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}
                  bodyStyle={cardBodyStyle}
                  cover={
                    <div style={cardHeaderStyle(colorPrimary)}>
                      <ProjectOutlined style={projectIconStyle} />
                    </div>
                  }
                  actions={[
                    <Button type='link' onClick={() => showModal(project)}>
                      Chỉnh sửa
                    </Button>,
                    <Button
                      type='link'
                      danger
                      onClick={() => handleDelete(project.id)}
                    >
                      Xóa
                    </Button>,
                  ]}
                >
                  <Link href={`/project/${project.id}`} style={linkStyle}>
                    <Title level={4} ellipsis style={projectTitleStyle}>
                      {project.name}
                    </Title>

                    <DateInfoItem
                      label='Ngày bắt đầu:'
                      date={formatDate(project.start_date)}
                      colorPrimary={colorPrimary}
                    />

                    <DateInfoItem
                      label='Ngày kết thúc:'
                      date={formatDate(project.end_date)}
                      colorPrimary={colorPrimary}
                    />

                    <div style={descriptionStyle}>
                      {project.description || 'Không có mô tả'}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      {/* status */}
                      <Tag color={project?.status_detail?.color}>
                        {project?.status_detail?.name}
                      </Tag>
                    </div>
                  </Link>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <ProjectModal
        visible={isModalVisible}
        isEditMode={isEditMode}
        project={currentProject}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  );
}

// Reusable components
const DateInfoItem: React.FC<{
  label: string;
  date: string;
  colorPrimary: string;
}> = ({ label, date, colorPrimary }) => (
  <div style={dateItemStyle}>
    <CalendarOutlined style={{ marginRight: 8, color: colorPrimary }} />
    <span style={{ fontWeight: 500 }}>{label}</span>
    <span style={{ marginLeft: 8 }}>{date}</span>
  </div>
);

// Styles
const pagePaddingStyle: CSSProperties = {
  padding: '24px',
};

const centerContainerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: '100px',
};

const alertStyle: CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
};

const titleStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '32px',
};

const linkStyle: CSSProperties = {
  height: '100%',
  textDecoration: 'none',
};

const cardStyle: CSSProperties = {
  height: '100%',
  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
};

const cardBodyStyle: CSSProperties = {
  padding: '16px',
};

const cardHeaderStyle = (color: string): CSSProperties => ({
  height: '120px',
  background: `linear-gradient(135deg, ${color} 0%, #87d068 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const projectIconStyle: CSSProperties = {
  fontSize: '48px',
  color: '#fff',
};

const projectTitleStyle: CSSProperties = {
  marginBottom: '16px',
};

const dateItemStyle: CSSProperties = {
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
};

const descriptionStyle: CSSProperties = {
  color: '#666',
  lineHeight: 1.6,
  minHeight: '60px',
  maxHeight: '80px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
};

export default ProjectList;
