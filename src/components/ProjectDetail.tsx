"use client";
import { useGetProjectDetailQuery } from "@/api/app_project/app_project";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, Spin, Alert } from "antd";

function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();

  const { data: project, error, isLoading } = useGetProjectDetailQuery(id);

  if (isLoading) return <Spin tip="Loading project details..." />;
  if (error) return <Alert message="Error loading project details" type="error" />;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Card title={project?.name} bordered={true}>
        <p><strong>Ngày bắt đầu:</strong> {project?.start_date}</p>
        <p><strong>Ngày kết thúc:</strong> {project?.end_date}</p>
        <p><strong>Mô tả:</strong> {project?.description}</p>
        <p><strong>Người tạo:</strong> {project?.user}</p>
        <p><strong>Thành viên:</strong> {project?.team_members?.length || 0}</p>
      </Card>
    </div>
  );
}

export default ProjectDetail;
