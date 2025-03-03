import { DatePicker, Form, Input, Modal, TimePicker } from "antd"
import { Controller, useForm } from "react-hook-form"
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project, Sheet } from "@/types/project";

dayjs.extend(customParseFormat)

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  selectedSheetId: string;
  projectId: string;
}

const taskFormSchema = z.object({
  project: z.string(),
  sheet: z.string(),
  title: z.string().min(1, "Please enter title."),
  start_date: z.date({
    required_error: "Please select start date.",
  }),
  deadline: z.date({
    required_error: "Please select deadline.",
  }),
  description: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>
const { RangePicker } = DatePicker;

export default function AddSheetModal({ open, setOpen, selectedSheetId, projectId }: Props) {


  const {
    control,
    handleSubmit
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      project: projectId || '',
      sheet: selectedSheetId || '',
      title: '',
      start_date: new Date(),
      deadline: dayjs().add(1, 'day') as unknown as Date,
      description: ''
    }
  });

  const [form] = Form.useForm()

  const onSubmit = (data: TaskFormValues) => {
    console.log(data)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const handleOk = () => {
    form.submit();
    setOpen(false)
  }

  return (
    <Modal
      title='Thêm công việc'
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleSubmit(onSubmit)} layout='vertical'>
        <Form.Item
          label='Dự án'
        >
          <Controller
            name="project"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label='Tên bảng'
        >
          <Controller
            name="sheet"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label='Thời gian'
        >
          <Controller
            name="start_date"
            control={control}
            render={({ field: { value, onChange } }) => <RangePicker
              // value={value}
              onChange={(dates) => {
                console.log(dates)
              }}
              style={{
                width: '100%'
              }}
              showTime
            />}
          />
        </Form.Item>
        {/* <Form.Item
          label='Thời gian kết thúc'
        >
          <Controller
            name="deadline"
            control={control}
            render={({ field }) => <RangePicker showTime />}
          />
        </Form.Item> */}
        <Form.Item
          label='Mô tả'
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}