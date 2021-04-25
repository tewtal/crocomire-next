import Layout from '../components/layout'
import { StrategyList } from '../components/strategyList'
import { InferGetServerSidePropsType } from 'next'
import { getStratById } from '../models/strat'
import { withSession } from '../lib/session'


export const getServerSideProps = withSession(async function (ctx) {
    const { req } = ctx;
    const { id } = ctx.query;
    const idNum = parseInt(id);
    const user = req.session.get('user');
    return { props: { strats: [await getStratById(idNum)], user } };
})

export default function Home({ strats, user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <Layout onSearch={null} user={user}>
            {strats[0] ? <StrategyList initialStrats={strats} user={user}/> : <h5>No strategy with that id exists in the database</h5>}
        </Layout>
    )
}

