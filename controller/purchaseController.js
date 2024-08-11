import Razorpay from 'razorpay';
import Order from '../model/orders';
import loginController from './userController';

exports.purchasepremium = async (req, res) => {
    try{
        console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
        console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);
        
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err){
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() =>{
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

exports.updateTransactionStatus = async(req, res, next) => {
    try {
        const { payment_id, order_id } = req.body;
        const userId = req.user.id

        const order = await Order.findOne({order_id});

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.payment_id = payment_id;
        order.status = "successful";
        //await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });

        //await req.user.update({ ispremiumuser: true });
        const updated=await User.findOneAndUpdate({_id:userId},{$set:{isPremiumUser:true}});
        res.status(202).json({ success: true, message: "Transaction Successful", token: loginController.generateAccessToken(userId, undefined, true) });

        // if (order.status === 'PENDING') {
            
        //     // If the status is 'PENDING', update to 'FAILED' on payment failure
        //     await order.update({ status: 'FAILED' });
        //     return res.status(400).json({ success: false, message: "Payment failed. Order status updated to FAILED." });
        // }

        
    } catch (err) {
        console.log('Something went wrong', err);
        res.status(403).json({ message: 'Something went wrong in update', error: err });
    }
}