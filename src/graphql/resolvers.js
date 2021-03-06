import { gql } from 'apollo-boost';

import { addItemToCart, clearItemFromCart, getCartItemCount, getCartTotal, removeItemFromCart } from './cart.utils';

export const typeDefs = gql`
    extend type Item {
        quantity: Int
    }

    extend type Mutation {
        ToggleCartHidden: Boolean!,
        AddItemToCart(item: Item!): [Item]!,
        RemoveItemFromCart(item: Item!): [Item]!,
        ClearItemFromCart(item: Item!): [Item]!
    }
`;
// typeDefs should Capitalize
// extend = extended existing type of mutation in backend
// [Item]! = dont know if theres item or not, but array must comeback

const GET_CART_HIDDEN = gql`
    {
        cartHidden @client
    }
`;

const GET_CART_ITEMS = gql`
    {
        cartItems @client
    }
`;

const GET_ITEM_COUNT = gql`
    {
        itemCount @client
    }
`

const GET_CART_TOTAL = gql`
    {
        cartTotal @client
    }
`;

const updateCartItemsRelatedQueries = (cache, newCartItems) => {
    cache.writeQuery({
        query: GET_ITEM_COUNT,
        data: { itemCount: getCartItemCount(newCartItems) }
    });

    cache.writeQuery({
        query: GET_CART_TOTAL,
        data: { cartTotal: getCartTotal(newCartItems) }
    });

    cache.writeQuery({
        query: GET_CART_ITEMS,
        data: { cartItems: newCartItems }
    });
}

export const resolvers = {
    // mutation, query, type that client cache can access
    Mutation: {
        toggleCartHidden: (_root, _args,{ cache } ) => {
            const { cartHidden } = cache.readQuery({
                query: GET_CART_HIDDEN 
            });

            cache.writeQuery({
                query: GET_CART_HIDDEN,
                data: { cartHidden: !cartHidden }
            });

            return !cartHidden;
        },

        addItemToCart: (_root, { item }, { cache } ) => {
            const { cartItems } = cache.readQuery({
                query: GET_CART_ITEMS
            });

            const newCartItems = addItemToCart(cartItems, item);
            
            updateCartItemsRelatedQueries(cache, newCartItems);
            
            return newCartItems;
        },

        removeItemFromCart: (_root, { item }, { cache } ) => {
            const { cartItems } = cache.readQuery({
                query: GET_CART_ITEMS
            });

            const newCartItems = removeItemFromCart(cartItems, item);

            updateCartItemsRelatedQueries(cache, newCartItems);

            return newCartItems;
        },

        clearItemFromCart: (_root, { item }, { cache } ) => {
            const { cartItems } = cache.readQuery({
                query: GET_CART_ITEMS
            });

            const newCartItems = clearItemFromCart(cartItems, item);

            updateCartItemsRelatedQueries(cache, newCartItems);

            return newCartItems;
        }
    }
}