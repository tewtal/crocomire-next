import { NextApiResponse } from 'next';
import { withSession, NextApiSessionRequest } from '../../../lib/session'

export default withSession(async (req: NextApiSessionRequest, res: NextApiResponse) => {
  const user = req.session.get("user");
  
  if(user) {
      // Don't return the users password
      res.json({...user, password: ''});
  } else {
      res.json({isLoggedIn: false})
  }

});
