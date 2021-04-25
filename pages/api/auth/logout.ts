import { NextApiResponse } from 'next';
import { withSession, NextApiSessionRequest } from '../../../lib/session'

export default withSession(async (req: NextApiSessionRequest, res: NextApiResponse) => {
  req.session.destroy();
  res.json({message: "Logged out"});
})
