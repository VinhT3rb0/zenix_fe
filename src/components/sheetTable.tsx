import React from 'react';
import { Table, Tag, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface Sheet {
    id: string;
    name: string;
    data: any[];
}

interface SheetTableProps {
    sheet: Sheet;
    handleDeleteSheet: (sheetId: string) => void;
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

const SheetTable: React.FC<SheetTableProps> = ({ sheet, handleDeleteSheet }) => {
    return (
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
    );
};

export default SheetTable;