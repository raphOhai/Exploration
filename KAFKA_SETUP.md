# Kafka Setup Guide

## Overview
This NestJS application is configured with Kafka producer and consumer services for event-driven messaging.

## Prerequisites
1. Start Kafka and Zookeeper via Docker Compose:
   ```bash
   docker compose up -d zookeeper kafka
   ```

2. Verify Kafka is running:
   - Kafka UI: http://localhost:8080
   - Kafka broker: localhost:9092

## Architecture

### Producer Service (`KafkaProducerService`)
- Located in `src/kafka/kafka-producer.service.ts`
- Automatically connects on module initialization
- Methods:
  - `sendMessage(topic, message)` - Send a message to a topic
  - `createTopicIfNotExists(topic, numPartitions)` - Create topic if it doesn't exist

### Consumer Service (`KafkaConsumerService`)
- Located in `src/kafka/kafka-consumer.service.ts`
- Automatically connects on module initialization
- Method:
  - `subscribe(topic, callback)` - Subscribe to a topic and process messages

### Event Consumer Service (`KafkaEventConsumerService`)
- Located in `src/kafka/kafka-event-consumer.service.ts`
- Example service that subscribes to `user-created` topic
- Automatically starts consuming on module initialization

## Usage Examples

### 1. Producing Messages (Already Implemented)
The `UsersService` automatically sends messages when a user is created:

```typescript
// In UsersService.create()
await this.kafkaProducer.sendMessage('user-created', {
  event: 'user.created',
  userId: savedUser.id,
  email: savedUser.email,
  name: savedUser.name,
  timestamp: new Date().toISOString(),
});
```

### 2. Consuming Messages (Already Implemented)
The `KafkaEventConsumerService` automatically subscribes to `user-created` topic and processes messages.

### 3. Creating a New Producer
```typescript
import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from '../kafka/kafka-producer.service';

@Injectable()
export class YourService {
  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async doSomething() {
    // Create topic first (optional, but recommended)
    await this.kafkaProducer.createTopicIfNotExists('your-topic');

    // Send message
    await this.kafkaProducer.sendMessage('your-topic', {
      data: 'your data here'
    });
  }
}
```

### 4. Creating a New Consumer
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from '../kafka/kafka-consumer.service';

@Injectable()
export class YourConsumerService implements OnModuleInit {
  constructor(private readonly kafkaConsumer: KafkaConsumerService) {}

  async onModuleInit() {
    await this.kafkaConsumer.subscribe('your-topic', (message) => {
      console.log('Received:', message);
      // Process your message here
    });
  }
}
```

## Topics

### Current Topics
- `user-created` - Published when a new user is created

### Creating Topics Manually

#### Via Kafka UI (Recommended)
1. Go to http://localhost:8080
2. Navigate to Topics
3. Click "Add a Topic"
4. Enter topic name and partitions

#### Via Command Line
```bash
docker exec -it kafka kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --topic your-topic-name \
  --partitions 1 \
  --replication-factor 1
```

#### Programmatically
```typescript
await this.kafkaProducer.createTopicIfNotExists('your-topic', 1);
```

## Testing

### Test Producer
Create a user via API:
```bash
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### View Messages in Kafka UI
1. Go to http://localhost:8080
2. Navigate to Topics → user-created
3. View messages in real-time

### Test Consumer
The consumer automatically processes messages. Check your console logs for:
```
Received message from topic user-created: { event: 'user.created', ... }
User created event received: { event: 'user.created', ... }
```

## Configuration

Kafka connection settings are in:
- `kafka-producer.service.ts` - Producer configuration
- `kafka-consumer.service.ts` - Consumer configuration

Default settings:
- Brokers: `localhost:9092`
- Client ID: `nestjs-producer` / `nestjs-consumer`
- Consumer Group: `nestjs-consumer-group`

## Troubleshooting

1. **Kafka not connecting**: Ensure Docker containers are running
   ```bash
   docker compose ps
   ```

2. **Topic not found**: Topics are auto-created, but you can create manually via Kafka UI

3. **Messages not consumed**: Check consumer group in Kafka UI and ensure service is running

