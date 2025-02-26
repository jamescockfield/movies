'use client';

import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import { useTasks } from '@/hooks/useTasks';
  
interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
}

export default function TaskList() {
  const { data: tasks, isLoading, error } = useTasks();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Failed to load tasks</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        My Tasks
      </Typography>
      <List>
        {tasks?.map((task: Task) => (
          <ListItem key={task.id}>
              <Card sx={{ width: '100%', mb: 1 }}>
                <CardContent>
                  <Typography variant="h6">{task.title}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Chip label={task.status} color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      Due: {task.dueDate}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}