import { InferGetServerSidePropsType } from 'next'
import { withSession } from '../../../lib/session'
import prisma from '../../../lib/prisma'
import Layout from "../../../components/layout";
import StratForm from '../../../components/stratForm'

export const getServerSideProps = withSession(async function (context) {
    const { req } = context;
    const stratId = parseInt(context.query.id);
    const strat = isNaN(stratId) ? null : await prisma.strat.findUnique({where: { id: stratId }});
    const user = req.session.get('user');
    const areas = await prisma.area.findMany();
    const rooms = await prisma.room.findMany();
    const categories = await prisma.category.findMany();
    return { props: { user, strat, areas, rooms, categories } }
})

export default function Strat({ user, strat, areas, rooms, categories }): InferGetServerSidePropsType<typeof getServerSideProps> {
    return user && user.isLoggedIn ? 
        strat ? (
        <Layout onSearch={null} user={user}>
            <StratForm strat={strat} areas={areas} rooms={rooms} categories={categories} />
        </Layout>
        ) : (<Layout onSearch={null} user={user}><h5>There is no strategy with this id.</h5></Layout>)
    : <Layout onSearch={null} user={user}><h5>You must be logged in to edit strategies.</h5></Layout>
}