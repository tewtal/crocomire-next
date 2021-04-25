import Layout from '../components/layout'
import { StrategyList } from '../components/strategyList'
import { InferGetServerSidePropsType } from 'next'
import { getAllStrats } from '../models/strat'
import { ChangeEventHandler, useState } from 'react'
import { withSession } from '../lib/session'
import useUser from '../lib/useUser'

export const getServerSideProps = withSession(async function ({ req, res }) {
    const user = req.session.get('user');    
    return { props: { strats: await getAllStrats(), user } }
})

export default function Home({ strats, user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [searchText, setSearchText] = useState<string>(null);
    
    const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
        setSearchText(e.target.value.toLowerCase());
    }

    const filteredStrats = searchText 
        ? strats.filter(s => 
            s.area.name.toLowerCase().includes(searchText) || 
            s.room.name.toLowerCase().includes(searchText) || 
            s.category.name.toLowerCase().includes(searchText) || 
            s.name.toLowerCase().includes(searchText) ||            
            s.description.toLowerCase().includes(searchText))
        : strats;

    return (
        <Layout onSearch={onSearch} user={user}>
            <StrategyList initialStrats={filteredStrats} user={user} />
        </Layout>
    )
}

