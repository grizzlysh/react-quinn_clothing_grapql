import { gql } from 'apollo-boost';

export const typeDefs = gql`
    extend type Mutation {
        ToggleCartHidden: Boolean!
    }
`;
// typeDefs should Capitalize
// extend = extended existing type of mutation in backend

const GET_CART_HIDDEN = gql`
    {
        cartHidden @client
    }
`;

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
        }
    }
}