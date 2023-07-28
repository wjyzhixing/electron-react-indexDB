import { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Space } from 'antd';
import db from './db';

const TodoList = () => {
  const [form] = Form.useForm();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // 从 IndexedDB 加载 todo 列表
    loadTodos();
  }, []);

  const loadTodos = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const todos = await db.todos.toArray();
    setTodos(todos);
  };

  const handleAddTodo = async (values: { price: string; name: string; type: string; }) => {
    const { price, name, type } = values;

    if (price.trim() === '' || name.trim() === '' || type.trim() === '') return;

    const newTodo = {
      price: price,
      name: name,
      type: type,
      completed: false,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await db.todos.add(newTodo);
    form.resetFields(); // 重置表单字段
    loadTodos();
  };

  const handleDeleteTodo = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await db.todos.delete(id);
    loadTodos();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => (
        <span
        >
          {price}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: string, record: { price: string; name: string; type: string; id: string }) => (
        <Space size="middle">
          <Button danger onClick={() => handleDeleteTodo(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form form={form} onFinish={handleAddTodo} layout="inline">
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input name!' }]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="type"
          rules={[{ required: true, message: 'Please input type!' }]}
        >
          <Input placeholder="type" />
        </Form.Item>
        <Form.Item
          name="price"
          rules={[{ required: true, message: 'Please input price!' }]}
        >
          <Input placeholder="Price" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Todo
          </Button>
        </Form.Item>
      </Form>
      <Table
        style={{ marginTop: '20px' }}
        columns={columns}
        dataSource={todos}
        rowKey="id"
      />
    </div>
  );
};

export default TodoList;
