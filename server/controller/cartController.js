import usercartModel from '../model.js';

export const addtocartController = async (req, res) => {
    try{
        const {quantity, name, price, email} = req.body;
        const userr = await usercartModel.findOne({ email });
        if(!userr) {
            const newCart = new usercartModel({
                email: email,
                items: [{ name, quantity, price }]
            });
            await newCart.save();
        }
        else {
            let found = 0;
            for(let i = 0; i < userr.items.length; i++) {
                if(userr.items[i].name === name) {
                    userr.items[i].quantity = quantity;
                    found = 1;
                    break;
                }
            }
            if(found === 0) {
                userr.items.push({ name, quantity, price });
            }
            await userr.save();
        }
        res.status(200).send({
            success: true,
            message:"Added to Cart"
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in adding to cart"
        });
    }
};

export const getcartController = async (req, res) => {
    
};

export const emptycartController = async (req, res) => {
    
};