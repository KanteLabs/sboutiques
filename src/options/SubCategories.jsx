import React from 'react';

const ChooseSubCategory = props => {
    switch (props.category) {
        case 'OUTERWEAR':
            return (
                <select
                    required
                    name="sub_category"
                    type="text"
                    onChange={e => props.handleChange(e)}
                >
                    <option defaultValue value="">
                        Select Category
                    </option>
                    <option value="BOMBERS">Bombers</option>
                    <option value="DENIM_JACKETS">Denim Jackets</option>
                    <option value="LIGHT_JACKETS">Light Jackets</option>
                    <option value="COATS">Coats</option>
                    <option value="PARKAS">Parkas</option>
                    <option value="RAINCOATS">Raincoats</option>
                    <option value="LEATHER_JACKETS">Leather Jackets</option>
                </select>
            );
        case 'TOPS':
            return (
                <select
                    required
                    name="sub_category"
                    type="text"
                    onChange={e => props.handleChange(e)}
                >
                    <option defaultValue value="">
                        Select Category
                    </option>
                    <option value="POLOS">Polos</option>
                    <option value="SHORT_SLEEVES">Short Sleeve T-Shirts</option>
                    <option value="LONG_SLEEVES">Long Sleeve T-Shirts</option>
                    <option value="HOODIES">Hoodies & Sweatshirts</option>
                    <option value="SWEATERS">Sweaters</option>
                </select>
            );
        case 'BOTTOMS':
            return (
                <select
                    required
                    name="sub_category"
                    type="text"
                    onChange={e => props.handleChange(e)}
                >
                    <option defaultValue value="">
                        Select Category
                    </option>
                    <option value="PANTS">Casual Pants</option>
                    <option value="DENIM_JEANS">Jeans / Denim</option>
                    <option value="SHORTS">Shorts</option>
                    <option value="SWEATPANTS">Sweatpants</option>
                    <option value="SWIMWEAR">Swimwear</option>
                </select>
            );
        case 'ACCESSORIES':
            return (
                <select
                    required
                    name="sub_category"
                    type="text"
                    onChange={e => props.handleChange(e)}
                >
                    <option defaultValue value="">
                        Select Category
                    </option>
                    <option value="BAGS">Bags</option>
                    <option value="BELTS">Belts</option>
                    <option value="GLASSES">Sunglasses & Glasses</option>
                    <option value="HATS">Hats</option>
                    <option value="JEWELRY">Jewelry</option>
                    <option value="WATCHES">Watches</option>
                    <option value="SOCKS">Socks</option>
                    <option value="UNDERWEAR">Underwear</option>
                    <option value="MISC">Miscellaneous</option>
                </select>
            );

        default:
            return <div />;
    }
};

export default ChooseSubCategory;
