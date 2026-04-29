
import express , {Request , Response} from 'express'
import { notFound } from "./middlewares/not-found";
import { errorHandlerMiddleware } from "./middlewares/error-handler"; 
import cookieParser from "cookie-parser";
import morgan from 'morgan'
// Routes
import authRouter from "./routes/auth.route";
import userRouter from './routes/user.route';
import landlordRouter from './routes/landlord.route';
import propertyRouter from './routes/property.route';
import ownershipRouter from './routes/ownership.route'

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"))

app.get('/api/v1' , (_req:Request , res:Response)=>{
    res.send('Property Management System')
})
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/landlord", landlordRouter);
app.use("/api/v1/property", propertyRouter);
app.use("/api/v1/ownership", ownershipRouter);

app.use(notFound);
app.use(errorHandlerMiddleware); 

export default app