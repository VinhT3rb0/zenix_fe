"use client";
import { useGetProjectsQuery } from "@/api/app_project/app_project";
import { Card, Col, Row, Spin, Alert } from "antd";
import Link from "next/link";

function ProjectList() {
  const { data, error, isLoading } = useGetProjectsQuery();

  if (isLoading) return <Spin tip="Loading..." />;
  if (error) return <Alert message="Error loading projects" type="error" />;

  // Kiểm tra dữ liệu trả về có đúng dạng mảng không
  const projects = Array.isArray(data?.results) ? data.results : [];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách Dự Án</h2>
      {projects.length === 0 ? (
        <Alert message="Không có dự án nào." type="info" />
      ) : (
        <Row gutter={[16, 16]}>
          {projects.map((project: any) => (
            <Col key={project.id} xs={24} sm={12} md={8} lg={6}>
              <Link href={`/project/${project.id}`}>
                <Card
                  title={project.name}
                  bordered={true}
                  style={{ width: "100%", cursor: "pointer" }}
                  hoverable
                >
                  <p><strong>Ngày bắt đầu:</strong> {project.start_date}</p>
                  <p><strong>Ngày kết thúc:</strong> {project.end_date}</p>
                  <p>{project.description}</p>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ProjectList;
