'use strict'

exports.handle = function handle(client) {

  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('app:response:name:welcome')
      client.addResponse('app:response:name:provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('app:response:name:provide/instructions')
      client.updateConversationState({
        helloSent: true
      })
      client.done()
    }
  })

  // Steps

  const whatIsHackCes = client.createStep({
      satisfied() {
          return false
      },

      prompt() {
          client.addTextResponse('Hello! Hack CES is ____')
          client.done
      }
  })

  const getEmail = client.createStep({
      satisfied() {
          return false
      },

      prompt() {
          client.addTextResponse('We are excited that you are interested! Could we please get your email to follow up?')
          client.done
      }
  })

  // Flow
  client.runFlow({
    classifications: {
        greeting: 'greeting'
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      greeting: ['whatIsHackCes', 'getEmail'],
      main: 'onboarding',
      onboarding: [sayHello, whatIsHackCes]
    }
  })
}
