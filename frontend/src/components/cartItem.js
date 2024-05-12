import React from 'react'
import './css/cartItem.css';
import { useNavigate  } from 'react-router-dom';

const CartItem = (props) => {
  const navigate=useNavigate();

    const {pay,name,price,bidder,userId,itemId,bidActive,feed,index}=props;

    const stopBidding=async()=>{
      const amount=price;
      const response = await fetch(`${window.location.origin}/carttwo/stopbid`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ userId, itemId, name, amount }), 
      });
      const data = await response.json();
      console.log(data);
      window.location.reload();
    }
  //   const handlePaymentClick = () => {
  //     // Navigate to the payment page and send props
  //     navigate('/payment', { state: { item: itemId, user: userId, itemName: name, price: price } });
  // };

  return (
    <div key={index} className="futuristic-card">
      <div className="futuristic-content">
        <div className="item-details">
          <h3 className='custom_h3'>{name}</h3>
          <h6 className='custom_h6'>Price: Rs.{price}{pay? " by ":"" }{bidder}</h6>
        </div>
        <div className="actions">
          {pay?(
                <>
                <button className="action-button" disabled={!bidActive} onClick={stopBidding}>
                    Stop Bid
                </button>
                <button className="cartitem_delete">
                    <svg viewBox="0 0 448 512" className="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
                </button>
                </>
                )
                :(<button className="Btn" onClick={()=>{navigate('/payment')}}>
                Pay
                <svg className="svgIcon" viewBox="0 0 576 512"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
                </button>)
           }
           {feed&&<button className="action-button">
                    Give Feedback
                </button>}

        </div>
      </div>
    </div>
  )
}

export default CartItem
