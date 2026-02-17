import type { JSX } from '@emotion/react/jsx-runtime';
import foodLady from '../../assets/foodlady.svg';
import { Navbar } from '../../common/navbar/navbar';
import { useOrderConformationController } from './oderConformation.controller';
import './orderConformation.css'
import { Cart } from '../cart/cart.page';
function OrderConformation(): JSX.Element {
    const { navbarLeft, navigate, orderId, email,showCart } = useOrderConformationController();

    return (
        <>
            <Navbar navbarLeft={navbarLeft} />

            <div className="page-wrapper">
                <div className="order-confirmation">
                    <div className="confirmation-card">

                        {/* Illustration */}
                        <div className="confirmation-illustration">
                            <img src={foodLady} alt="Order Placed" />
                        </div>

                        {/* Text */}
                        <h1 className="confirmation-title">
                            Your Order Has Been Placed !
                        </h1>

                        <p className="confirmation-text">
                            Your Order Number is <strong>{orderId}</strong>.
                        </p>

                        <p className="confirmation-text">
                            A confirmation of your order has been sent to
                        </p>

                        <p className="confirmation-text confirmation-email">
                            {email}
                        </p>

                        {/* Actions */}
                        <div className="confirmation-actions">
                            <button className="btn-outline" onClick={() => {
                                navigate('/')
                            }}>
                                Continue Shopping
                            </button>

                            <button className="btn-primary" onClick={() => {
                                navigate('/AccountSetting', {
                                    state: {
                                        orders: true
                                    }
                                });

                            }}>
                                View Order Details
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            {showCart && <div onMouseDown={(e) => e.stopPropagation()}>
                <Cart></Cart>
            </div>}
        </>
    );
}

export { OrderConformation };
