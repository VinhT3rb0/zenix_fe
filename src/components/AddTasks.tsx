import { Button, Form, Input, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import {
  useCreateSheetsMutation,
  useCreateTasksMutation,
  useGetTasksQuery,
} from '@/api/app_project/app_project';
import React from 'react';

interface Sheet {
  id: string;
  name: string;
  data: any[];
}

const AddTasks = ({
  isAddTasksModalOpen,
  setIsAddTasksModalOpen,
  sheetsId,
  projectId,
}: {
  isAddTasksModalOpen: boolean;
  setIsAddTasksModalOpen: (isAddTasksModalOpen: boolean) => void;
  sheetsId: string;
  projectId: string;
}) => {
  const [form] = Form.useForm();
  const [createTasks] = useCreateTasksMutation();
  const { refetch: refetchTasks } = useGetTasksQuery();

  const handleCancel = () => {
    setIsAddTasksModalOpen(false);
  };

  const handleOk = async (values: any) => {
    // try {
    //   await form.validateFields();
    //   const result = await createTasks({
    //     title: values.title,
    //     project: projectId,
    //     sheet: sheetsId,
    //   }).unwrap();

    //   if (result) {
    //     message.success('Thêm tasks thành công');
    //   }
    // } catch (error) {
    //   message.error('Thêm tasks thất bại');
    // }

    console.log(values);

    setIsAddTasksModalOpen(false);
  };

  const handleFinish = async (values: any) => {
    try {
      await form.validateFields();
      const result = await createTasks({
        title: values.title,
        project: projectId,
        sheet: sheetsId,
      }).unwrap();

      if (result) {
        message.success('Thêm tasks thành công');
      }
    } catch (error) {
      message.error('Thêm tasks thất bại');
    }

    refetchTasks();
    setIsAddTasksModalOpen(false);
  };

  return (
    <Modal
      title='Thêm tasks'
      open={isAddTasksModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout='vertical' onFinish={handleFinish}>
        <Form.Item
          label='Tên tasks'
          name='title'
          rules={[{ required: true, message: 'Vui lòng nhập tên bảng!' }]}
        >
          <Input />
        </Form.Item>

        <Button type='primary' htmlType='submit'>
          Thêm tasks
        </Button>
      </Form>
    </Modal>
  );
};

export default AddTasks;
