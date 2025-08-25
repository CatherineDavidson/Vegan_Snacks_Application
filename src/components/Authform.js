import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ApplyForm = () => {

    const[snackName,setSnackName] = useState("");
    const[snackType,setSnackType] = useState("");
    const[quantity,setQuantity] = useState("");
    const[price,setPrice] = useState("");
    const[expiry,setExpiry] = useState("");
    const[success,setSuccess] = useState("");
    const[errors,setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if(!snackName) errs.snackName = "Snack Name is required";
        if(!snackType) errs.snackType = "Snack Type is required";
        if(!quantity) errs.quantity = "Quantity is required";
        if(!price) errs.price = "Price is required";
        else if(parseFloat(price)<0) errs.price = "Price must be positive number";
        if(expiry === "") errs.expiry = "Expiry in months is required";
        else if(parseInt(expiry)<0) errs.expiry = "Expiry must be a Non-negative number";
        return errs;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if(Object.keys(validationErrors).length !== 0 ) return;

        const data = {
            snackName,
            snackType,
            quantity,
            price : parseInt(price),
            expiryInMonths : parseInt(expiry)
        };

        try{
            const response = await fetch("https://vegan-snacks.onrender.com/addVeganSnack", {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify(data)
            });

            if(response.ok){
                setSuccess("Snack submitted successfully!");
                setSnackName("");
                setSnackType("");
                setQuantity("");
                setPrice("");
                setExpiry("");
                setTimeout(()=>{
                    setSuccess("");
                    navigate("/getAllVeganSnacks");
                },1000);
            } else {
                console.error("Failed to submit snack");
            }
        }
        catch(err) {
            console.error("Error : ",err);
        }
    };

    return(
        <div>
            <h2>Add a Vegan Snack</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="snackName">Snack Name:</label>
                <input
                    id = "snackName"
                    type="text"
                    value={snackName}
                    onChange={(e)=>setSnackName(e.target.value)}
                />
                {errors.snackName && <p>{errors.snackName}</p>}
                
                <label htmlFor="snackType">Snack Type:</label>
                <input
                    id = "snackType"
                    type="text"
                    value={snackType}
                    onChange={(e)=>setSnackType(e.target.value)}
                />
                {errors.snackType && <p>{errors.snackType}</p>}

                <label htmlFor="quantity">Quantity:</label>
                <input
                    id = "quantity"
                    type="text"
                    value={quantity}
                    onChange={(e)=>setQuantity(e.target.value)}
                />
                {errors.quantity && <p>{errors.quantity}</p>}

                <label htmlFor="price">Price:</label>
                <input
                    id = "price"
                    type="number"
                    value={price}
                    onChange={(e)=>setPrice(e.target.value)}
                />
                {errors.price && <p>{errors.price}</p>}

                <label htmlFor="expiry">Expiry (in months):</label>
                <input
                    id = "expiry"
                    type="number"
                    value={expiry}
                    onChange={(e)=>setExpiry(e.target.value)}
                />
                {errors.expiry && <p>{errors.expiry}</p>}

                <button type="submit">Submit</button>
                <button type="button" onClick={() => navigate("/getAllVeganSnacks")}>Back</button>
            </form>

            {success && <p>{success}</p>}
        </div>
    )
};

export default ApplyForm;