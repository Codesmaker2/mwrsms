import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { RxCaretLeft, RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import {  TbListDetails } from "react-icons/tb";

const UserOrderDetails = ({active}) => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch,user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  
  const refundHandler = async () => {
    await axios.put(`${server}/order/order-refund/${id}`,{
      status: "Processing refund"
    }).then((res) => {
       toast.success(res.data.message);
    dispatch(getAllOrdersOfUser(user._id));
    }).catch((error) => {
      toast.error(error.response.data.message);
    })
  };

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <Link to={"/profile"}>
        <RxCaretLeft size={40} color={`${active === 2 ? "gray" : "blue"}`} className="cursor pointer"/>
      </Link>
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center justify-center">
          <TbListDetails size={50} className="text-blue-500"/>
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-center pt-6">
        <h5 className="text-[#0f21ae84]">
          Order ID: <span className="mr-2">#{data?._id?.slice(0, 8)}</span><span className="mr-2">|</span>
        </h5>
        <h5 className="text-[#00000084]">
          Ordered on: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* order items */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => {
          return(
          <div className="w-full flex items-start mb-5">
            <img
              src={`${item.images[0]?.url}`}
              alt=""
              className="w-[80x] h-[80px]"
            />
            <div className="w-full">
              <h5 className="pl-3 text-[20px] max-400px:text-[15px]">{item.name}</h5>
              <h5 className="pl-3 text-[20px] text-[#00000091]">
                P{item.discountPrice} x {item.qty}
              </h5>
            </div>
            {!item.isReviewed && data?.status === "Delivered" ?  <div
                className="w-[150px] border border-blue-500 h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer text-blue-500 max-400px:h-[30px]"
                onClick={() => setOpen(true) || setSelectedItem(item)}
              >
               <h4 className="max-400px:text-[11px]">Write a review</h4> 
              </div> : (
             null
            )}
          </div>
          )
         })}

      {/* review popup */}
      {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="w-[50%] h-min bg-[#fff] shadow rounded-md p-3 max-400px:w-[90%]">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-[30px] font-[500] font-Poppins text-center max-400px:text-[20px]">
              Hi ! {data?.user?.name} <br />Please Give me a Review
            </h2>
            <br />
            <div className="w-full flex">
              <img
                src={`${selectedItem?.images[0]?.url}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div>
                <div className="pl-3 text-[20px]">{selectedItem?.name}</div>
                <h4 className="pl-3 text-[20px]">
                  P{selectedItem?.discountPrice} x {selectedItem?.qty}
                </h4>
              </div>
            </div>

            <br />
            <br />

            {/* ratings */}
            <h5 className="pl-3 text-[20px] font-[500]">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full ml-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            <div className="w-full ml-3">
              <label className="block text-[20px] font-[500]">
                Write a comment
                <span className="ml-1 font-[400] text-[16px] text-[#00000052]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                id=""
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? write your expresion about it!"
                className="mt-2 w-[95%] border p-2 outline-none"
              ></textarea>
            </div>
            <div
              className={`${styles.button} text-white text-[20px] ml-3`}
              onClick={rating > 1 ? reviewHandler : null}
            >
              Submit
            </div>
          </div>
        </div>
      )}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>P{data?.totalPrice}</strong>
        </h5>
      </div>
      <br />
      <br />
      <hr />
      <div className="w-full 800px:flex items-center border p-2 bg-white">
        <div className="w-full 800px:w-[60%]">
        <h4 className="pt-3 text-[20px] font-[600]">Customer Info:</h4>
        <div className="flex "><h1 className="max-400px:text-[15px] mr-1 pt-2 ">Customer Name: </h1><h4 className="max-400px:text-[15px]  pt-2"> {data?.user?.name}</h4></div>
          <div className="flex "><h1 className="text-[15px] mr-1">Conctact Number : </h1><h4 className="max-400px:text-[15px] "># {data?.user?.phoneNumber}</h4></div>
          

        </div>
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Delivery Address:</h4>
          <h4 className="pt-3 800px:text-[15px]   max-400px:text-[15px]">
            {data?.shippingAddress.address1 +
              ", " +
              data?.shippingAddress.address2}
          </h4>
          <h4 className=" text-[20px] 800px:text-[15px]">{data?.shippingAddress.country}</h4>
          <h4 className=" text-[20px] 800px:text-[15px]">{data?.shippingAddress.city}</h4>
         
        </div>
        <br />
        <hr />
        <div className="w-full 800px:w-[40%]">
          <div className="flex pt-4 text-[20px] max-400px:text-[17px] items-center max-400px:justify-end">
          <h4 className="shadow-sm">
             Payment Status:{" "}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h4>
          </div>
          <br />
           {
            data?.status === "Delivered" && (
              <div className={`${styles.button} text-white`}
              onClick={refundHandler}
              >Give a Refund</div>
            )
           }
        </div>
      </div>
      <br />
      <Link to="/">
        <div className={`${styles.button} text-white`}>Send Message</div>
      </Link>
      <br />
      <br />
    </div>
  );
};

export default UserOrderDetails;
