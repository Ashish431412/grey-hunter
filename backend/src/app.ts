import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';

// Routes imports
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
// import projectRoutes from './modules/projects/project.routes';
// import taskRoutes from './modules/projects/task.routes';
// import toolRoutes from './modules/tools/tool.routes';
// import syncRoutes from './modules/sync/sync.routes';
// import auditRoutes from './modules/audit/audit.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/tools', toolRoutes);
// app.use('/api/sync', syncRoutes);
// app.use('/api/audit', auditRoutes);

app.use(errorHandler);

export default app;
