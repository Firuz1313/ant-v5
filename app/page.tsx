'use client'

import { Button, Typography, Space, Card } from 'antd'
import { SmileOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

export default function Home() {
  return (
    <main className="main-container">
      <Card className="welcome-card">
        <Space direction="vertical" size="large" className="content-wrapper">
          <Title level={1} className="main-title">
            <SmileOutlined className="title-icon" />
            Welcome to Ant Design v5!
          </Title>
          
          <Paragraph className="description">
            This is a Next.js application with Ant Design v5 components.
            Everything is working properly now!
          </Paragraph>
          
          <Space>
            <Button type="primary" size="large">
              Primary Button
            </Button>
            <Button size="large">
              Default Button
            </Button>
          </Space>
        </Space>
      </Card>
    </main>
  )
}
