import type { JSX } from "@emotion/react/jsx-runtime";
import { Navbar } from "../../common/navbar/navbar";
import { Footer } from "../../common/footer/footer";
import { useMediaQuery, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import './tnc.css'
import Marquee from "../../common/marquee/marquee";

export const Tnc = (): JSX.Element => {
    const location = useLocation();
    const { tnc, privacy, shipping, refund } = location.state
    const navbarLeft = [
        { path: "/about", name: "OUR JOURNEY" },
        { path: "/shop", name: "SHOP" },
        { path: "/recipe", name: "RECIPES" },
    ]
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const marqueeText = Array.from({ length: 12 }).map((_, i) => ({
        id: i + 1,
        text: "Flat 50% off on orders above $399",
    }))
    return <>
        <Navbar navbarLeft={navbarLeft}></Navbar>
        <Marquee
            direction='left'
            duration={50}
            items={marqueeText}
            useMargin={true}
            stop={false}
            options={{
                height: '45px'
            }}
        ></Marquee>
        {tnc && (
            <div className="tncPage">
                <div className="tncContainer">
                    <div className="tncCard">
                        <div className="tncHeader">
                            <h2 className="tncTitle">Terms & Conditions</h2>
                            <p className="tncSubtitle">Last updated: January 31, 2026</p>
                        </div>

                        <div className="tncContent">
                            <h3>1. Introduction</h3>
                            <p>
                                Welcome to Build My Body (BMB). These Terms & Conditions govern your access to and
                                use of our website and services. By visiting, browsing, or purchasing from our
                                website, you agree to comply with these Terms & Conditions.
                            </p>
                            <p>
                                We recommend that you read these Terms carefully before using our website. If you
                                do not agree with any part of these Terms, you may choose not to use our services.
                            </p>

                            <h3>2. Use of Website</h3>
                            <ul>
                                <li>You must be at least 18 years old or have parental/guardian consent to use our services.</li>
                                <li>You agree to use the website only for lawful purposes.</li>
                                <li>
                                    You must not misuse the website, attempt unauthorized access, or engage in any
                                    activity that disrupts our services.
                                </li>
                                <li>
                                    Build My Body (BMB) reserves the right to restrict or terminate access to the
                                    website if misuse is identified.
                                </li>
                            </ul>

                            <h3>3. Product Information</h3>
                            <ul>
                                <li>
                                    We strive to provide accurate product descriptions, images, pricing, and other
                                    information. However, minor errors or variations may occur.
                                </li>
                                <li>Product images are for illustrative purposes only and may differ slightly from actual products.</li>
                                <li>
                                    Build My Body (BMB) reserves the right to modify, update, or discontinue any
                                    product or service at any time without prior notice.
                                </li>
                            </ul>

                            <h3>4. Orders & Payments</h3>
                            <ul>
                                <li>All orders placed on the website are subject to acceptance and availability.</li>
                                <li>
                                    BMB reserves the right to cancel or refuse any order at its discretion, including
                                    in cases of pricing errors or suspicious transactions.
                                </li>
                                <li>Prices may change without prior notice.</li>
                                <li>Payments must be made through the payment methods available on our website.</li>
                            </ul>

                            <h3>5. Intellectual Property</h3>
                            <ul>
                                <li>
                                    All content on this website, including text, images, logos, graphics, designs,
                                    and software, is the property of Build My Body (BMB) and is protected by
                                    applicable intellectual property laws.
                                </li>
                                <li>
                                    Any unauthorized use, reproduction, or distribution of website content is
                                    strictly prohibited.
                                </li>
                            </ul>

                            <h3>6. Limitation of Liability</h3>
                            <p>
                                Build My Body (BMB) is committed to providing reliable services and quality
                                products. However, Build My Body (BMB) shall not be responsible for any losses or
                                damages arising from circumstances beyond reasonable control, including technical
                                issues, third-party service interruptions, or improper use of products.
                            </p>
                            <p>
                                Nothing in these Terms limits your rights under applicable laws. Any liability of
                                BMB, if applicable, shall be limited to the extent permitted by law.
                            </p>

                            <h3>7. Third-Party Links</h3>
                            <p>
                                Our website may contain links to third-party websites or services. BMB is not
                                responsible for the content, policies, or practices of such third parties.
                            </p>

                            <h3>8. Changes to Terms</h3>
                            <p>
                                Build My Body (BMB) reserves the right to update or modify these Terms & Conditions
                                at any time. Any changes will be effective immediately upon posting on the
                                website. Continued use of the website constitutes acceptance of the updated Terms.
                            </p>

                            <h3>9. Governing Law</h3>
                            <p>
                                These Terms & Conditions shall be governed by and interpreted in accordance with
                                the laws of India. Any disputes shall be subject to the jurisdiction of Indian
                                courts.
                            </p>

                            <h3>10. Contact Information</h3>
                            <p>For any questions regarding these Terms & Conditions, please contact us:</p>

                            <div className="tncCallout">
                                <p>📧 Email: info@bmbstore.in</p>
                                <p>📞 Phone: 6284048739</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}


        {shipping && (
            <div className="tncPage">
                <div className="tncContainer">
                    <div className="tncCard">
                        <div className="tncHeader">
                            <h2 className="tncTitle">Shipping & Delivery Policy</h2>
                            <p className="tncSubtitle">Last updated: January 31, 2026</p>
                        </div>

                        <div className="tncContent">
                            <h3>1. Shipping Coverage</h3>
                            <p>We currently ship products across India.</p>

                            <h3>2. Processing Time</h3>
                            <p>Orders are usually processed within 1–3 business days after confirmation.</p>

                            <h3>3. Delivery Time</h3>
                            <p>Delivery typically takes 3–7 business days depending on location.</p>
                            <p>Delays may occur due to unforeseen circumstances (weather, logistics issues, etc.).</p>

                            <h3>4. Shipping Charges</h3>
                            <p>Shipping charges (if any) will be displayed at checkout.</p>

                            <h3>5. Order Tracking</h3>
                            <p>Once your order is shipped, tracking details will be shared via email/SMS.</p>

                            <h3>6. Failed Delivery</h3>
                            <p>
                                If delivery fails due to incorrect address or unavailability of the customer,
                                re-shipping charges may apply.
                            </p>

                            <h3>7. Damaged or Missing Products</h3>
                            <p>
                                If you receive a damaged or incorrect product, please contact us within 48 hours
                                of delivery with photos/video proof.
                            </p>

                            {/* Optional: contact callout box (recommended) */}
                            <div className="tncCallout">
                                <p>Need help? Reach us at:</p>
                                <p>📧 Email: info@bmbstore.in</p>
                                <p>📞 Phone: 6284048739</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {refund && (
            <div className="tncPage">
                <div className="tncContainer">
                    <div className="tncCard">
                        <div className="tncHeader">
                            <h2 className="tncTitle">Return & Refund Policy</h2>
                            <p className="tncSubtitle">Last updated: January 31, 2026</p>
                        </div>

                        <div className="tncContent">
                            <p>
                                At Build My Body (BMB), we strive to ensure that our customers are satisfied
                                with every purchase. However, if you are not completely satisfied with your
                                order, returns and refunds are subject to the terms outlined below.
                            </p>

                            <h3>1. Refund Policy</h3>
                            <p>We offer refunds only under the following circumstances:</p>
                            <ul>
                                <li>If you receive a damaged or defective product.</li>
                                <li>If the product delivered is incorrect compared to what was ordered.</li>
                                <li>If the product is expired at the time of delivery.</li>
                            </ul>

                            <p><strong>Refund Process:</strong></p>
                            <ul>
                                <li>You must raise a refund request within 48 hours of receiving the order.</li>
                                <li>
                                    Email us at <strong>info@bmbstore.in</strong> with your order ID,
                                    product images, and reason for the refund.
                                </li>
                                <li>
                                    Our team will verify the request and initiate the refund within
                                    <strong> 7–10 business days</strong> after approval.
                                </li>
                                <li>Refunds will be processed to the original payment method.</li>
                            </ul>

                            <h3>2. Return Policy</h3>
                            <ul>
                                <li>Returns are not accepted due to hygiene and safety reasons.</li>
                                <li>If you receive a defective or incorrect product, a replacement or refund will be provided.</li>
                                <li>For Cash on Delivery (COD) orders, shipping + COD charges are non-refundable.</li>
                                <li>For prepaid orders, shipping charges are non-refundable.</li>
                            </ul>

                            <h3>3. Courier Rejection Policy</h3>
                            <ul>
                                <li>
                                    If the package is rejected upon delivery due to damage, please inform us
                                    immediately at <strong>info@bmbstore.in</strong> with supporting images.
                                </li>
                                <li>
                                    If rejection occurs due to an incorrect address or customer unavailability,
                                    re-delivery charges may apply.
                                </li>
                                <li>
                                    The deduction amount will be equivalent to shipping charges + COD charges
                                    applied to the order.
                                </li>
                                <li>
                                    If the courier is rejected without a valid reason, shipping cost + COD
                                    charges will be deducted from the refund amount.
                                </li>
                            </ul>

                            <h3>4. Cancellation Policy</h3>
                            <ul>
                                <li>Orders can be canceled only before they are shipped.</li>
                                <li>To cancel, email <strong>info@bmbstore.in</strong> with your order ID.</li>
                                <li>If the order has already been shipped, cancellation is not possible.</li>
                                <li>
                                    If canceled after shipping, a cancellation charge equivalent to shipping
                                    charges + COD will be deducted.
                                </li>
                                <li>Refunds for approved cancellations will be processed within 7–10 business days.</li>
                            </ul>

                            <h3>5. Changes to Policy</h3>
                            <p>
                                Build My Body (BMB) reserves the right to modify this Return & Refund Policy
                                at any time without prior notice. Changes will be effective once posted on
                                the website.
                            </p>

                            <h3>6. General Policy Clause</h3>
                            <p>
                                All rights related to orders that are not explicitly covered in these policies
                                will be decided solely by Build My Body (BMB).
                            </p>

                            <h3>7. Contact Us</h3>
                            <div className="tncCallout">
                                <p>📧 Email: info@bmbstore.in</p>
                                <p>📞 Phone: 6284048739</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}


        {privacy && (
            <div className="tncPage">
                <div className="tncContainer">
                    <div className="tncCard">
                        <div className="tncHeader">
                            <h2 className="tncTitle">Privacy Policy</h2>
                            <p className="tncSubtitle">Last updated: January 31, 2026</p>
                        </div>

                        <div className="tncContent">
                            <p>
                                At Build My Body (BMB), we value your trust and are committed to protecting your
                                personal information. This Privacy Policy explains how we collect, use, store,
                                and protect your data when you visit or make a purchase from our website.
                            </p>
                            <p>
                                By using our website, you agree to the practices described in this Privacy Policy.
                            </p>

                            <h3>1. Information We Collect</h3>
                            <p>We may collect the following types of information:</p>

                            <p><strong>a) Personal Information</strong></p>
                            <ul>
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Phone number</li>
                                <li>Shipping and billing address</li>
                            </ul>

                            <p><strong>b) Order & Payment Information</strong></p>
                            <ul>
                                <li>Order details and transaction information</li>
                                <li>
                                    Payment information processed securely through third-party payment gateways
                                    (Note: We do not store your card or banking details.)
                                </li>
                            </ul>

                            <p><strong>c) Technical Information</strong></p>
                            <ul>
                                <li>IP address</li>
                                <li>Browser type</li>
                                <li>Device information</li>
                                <li>Website usage data through cookies and analytics tools</li>
                            </ul>

                            <h3>2. How We Use Your Information</h3>
                            <p>We use your information to:</p>
                            <ul>
                                <li>Process and deliver your orders</li>
                                <li>Communicate order updates, offers, and customer support</li>
                                <li>Improve our website, products, and services</li>
                                <li>Prevent fraud and ensure website security</li>
                                <li>Comply with legal obligations</li>
                            </ul>

                            <h3>3. Sharing of Information</h3>
                            <p>
                                We do not sell, rent, or trade your personal information. We may share your data
                                only with trusted third parties such as:
                            </p>
                            <ul>
                                <li>Payment gateway providers</li>
                                <li>Courier and logistics partners</li>
                                <li>IT and analytics service providers</li>
                            </ul>
                            <p>
                                Such sharing is strictly limited to what is necessary to provide our services.
                            </p>

                            <h3>4. Data Security</h3>
                            <p>
                                We implement reasonable security measures to protect your personal information
                                from unauthorized access, alteration, disclosure, or destruction.
                            </p>
                            <p>
                                However, no method of transmission over the internet is completely secure, and we
                                cannot guarantee absolute security of data.
                            </p>

                            <h3>5. Cookies Policy</h3>
                            <p>
                                Our website uses cookies and similar technologies to enhance your browsing
                                experience. Cookies help us understand user behavior and improve website
                                performance.
                            </p>
                            <p>
                                You can choose to disable cookies through your browser settings, but some features
                                of the website may not function properly.
                            </p>

                            <h3>6. Third-Party Links</h3>
                            <p>
                                Our website may contain links to third-party websites. Build My Body (BMB) is not
                                responsible for the privacy practices or content of such websites. We encourage
                                you to read their privacy policies before sharing any personal information.
                            </p>

                            <h3>7. User Rights</h3>
                            <p>You have the right to:</p>
                            <ul>
                                <li>Access your personal information</li>
                                <li>Request correction of inaccurate data</li>
                                <li>
                                    Request deletion of your personal data (subject to legal and operational
                                    requirements)
                                </li>
                            </ul>
                            <p>
                                To exercise these rights, please contact us using the details below.
                            </p>

                            <h3>8. Changes to This Policy</h3>
                            <p>
                                Build My Body (BMB) reserves the right to update or modify this Privacy Policy at
                                any time. Any changes will be effective immediately upon posting on the website.
                                Continued use of the website constitutes acceptance of the updated policy.
                            </p>

                            <h3>9. Contact Us</h3>
                            <div className="tncCallout">
                                <p>📧 Email: info@bmbstore.in</p>
                                <p>📞 Phone: 6284048739</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}


        <Footer isMobile={isMobile}></Footer>
    </>
}