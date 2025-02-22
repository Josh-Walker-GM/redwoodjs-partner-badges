import { navigate, routes } from '@redwoodjs/router'
import { MetaTags, useQuery } from '@redwoodjs/web'

import Icon from 'src/components/Icon/Icon'
import useCookie from 'src/hooks/useCookie'

const FIND_PARTICIPANT_QUERY = gql`
  query findParticipantQuery($id: Int!) {
    participant(id: $id) {
      id
      githubId
    }
  }
`

const CustomizeTicketPage = () => {
  // If there is no participantId cookie, redirect to the home page
  const [participantId] = useCookie('participantId')
  if (!participantId) {
    navigate(routes.home())
  }

  // check to see if the user has already customized their ticket
  const { loading, data, error } = useQuery(FIND_PARTICIPANT_QUERY, {
    variables: { id: parseInt(participantId) },
  })

  // if the user has already customized their ticket, redirect to the share page
  if (!loading && !error && data?.participant?.githubId) {
    navigate(routes.share())
  }

  return (
    <>
      <MetaTags
        title="Customize your RedwoodJS Conference Ticket"
        description="Personalize your virtual ticket for the RedwoodJS Conference, connecting it to your GitHub account."
      />

      <main className="page flex h-full items-center">
        <div>
          <h1 className="page-title">You&apos;re In!</h1>
          <h2 className="subheading mb-12 text-chestnutRose">
            Now Make it Yours
          </h2>
          <a
            href={`https://github.com/login/oauth/authorize?client_id=${
              process.env.GITHUB_OAUTH_CLIENT_ID
            }&redirect_uri=${
              process.env.GITHUB_OAUTH_REDIRECT_URI +
              `?participantId=${participantId}`
            }&scope=${process.env.GITHUB_OAUTH_SCOPES.split(' ').join('+')}`}
            className="share-button mb-4"
          >
            <Icon id="github" />
            Customize Your Ticket
          </a>
          <p className="text font-xs text-center">
            Only public information will be used.
          </p>
        </div>
      </main>
    </>
  )
}

export default CustomizeTicketPage
