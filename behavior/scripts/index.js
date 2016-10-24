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

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('app:response:name:apology/untrained')
      client.done()
    }
  })

  // Steps
  const handleGreeting = client.createStep({
      satisfied() {
          return false
      },

      prompt() {
          client.addTextResponse('Hello world, I mean human')
          client.done()
      }
  })

  const handleGoodbye = client.createStep({
      satisfied() {
          return false
      },

      prompt() {
          client.addTextResponse('See you later!')
          client.done
      }
  })

  // Flow
  client.runFlow({
    classifications: {
        goodbye: 'goodbye',
        greeting: 'greeting',
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      greeting: handleGreeting
      goodbye: handleGoodbye
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained]
    }
  })
}
