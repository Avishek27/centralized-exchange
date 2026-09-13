import express from "express";
import cors from "cors";
import { orderRouter } from "./routes/orderRouter";
import { klines } from "./routes/klines";



const app = express();
const PORT = Number(process.env.PORT || 3000);
app.use(cors());

app.use(express.json());



app.use("/api/v1/orderRouter",orderRouter);
app.use("/api/v1/klines",klines);




app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})