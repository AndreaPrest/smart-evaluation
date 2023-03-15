export default function({$auth,error})
{
  try{
    const user = $auth.user
    if(!user || !user.roles.includes("Administrator"))
    {
      error({ statusCode: 401, message: 'Not Authorized' })

    }
  }catch(err)
  {
    error({ statusCode: 500, message: 'General Error' })
  }




}
