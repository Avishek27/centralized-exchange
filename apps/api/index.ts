import express from "express";
import cors from "cors";
import { orderRouter } from "./routes/orderRouter";



const app = express();
const PORT = 3000;
app.use(cors());

app.use(express.json());



app.use("/api/v1/orderRouter",orderRouter);





app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})