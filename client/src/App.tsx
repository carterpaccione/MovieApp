import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';

import Header from './components/header.js';
import Footer from './components/footer.js';
import './styles/main.css';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const client = new ApolloClient ({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Header></Header>
            <Outlet />
            <Footer></Footer>
        </ApolloProvider>
    )
}

export default App;