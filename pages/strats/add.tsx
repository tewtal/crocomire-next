import { InferGetServerSidePropsType } from 'next'
import { withSession } from '../../lib/session'
import prisma from '../../lib/prisma'
import Layout from "../../components/layout";
import StratForm from '../../components/stratForm'

export const getServerSideProps = withSession(async function ({ req, res }) {
    const user = req.session.get('user');
    const areas = await prisma.area.findMany();
    const rooms = await prisma.room.findMany();
    const categories = await prisma.category.findMany();

    return { props: { user, areas, rooms, categories } }
})

export default function Strat({ user, areas, rooms, categories }): InferGetServerSidePropsType<typeof getServerSideProps> {
    return user && user.isLoggedIn ? (
        <Layout onSearch={null} user={user}>
            <StratForm strat={null} areas={areas} rooms={rooms} categories={categories} />
        </Layout>
    ) : <Layout onSearch={null} user={user}><h5>You must be logged in to add new strategies.</h5></Layout>
}