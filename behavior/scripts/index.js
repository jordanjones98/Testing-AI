// 'use strict'
//
// exports.handle = function handle(client) {
//   const sayHello = client.createStep({
//         satisfied() {
//           return false
//         },
//
//       prompt() {
//           client.addTextResponse('Hello world, I mean human')
//           client.done()
//       }
//   })
//
//   const goingToCES = client.createStep({
//       client.addTextResponse('Great! You\'re going to CES!')
//   })
//
//   const notGoingToCES = client.createStep({
//       client.addTextResponse('Hmm... You\'re not going.. Check out out here!')
//   })
//
//   const checkIfAfirmative = client.createStep({
//     satisfied() {
//       return (typeof client.getConversationState().isAfirmative !== 'undefined')
//     },
//
//     next() {
//       const isOverEighteen = client.getConversationState().isAfirmative
//       if (isAfirmative === true) {
//           return 'afirmativeGoing'
//       } else if (isAfirmative === false) {
//           return 'afirmativeNotGoing'
//       }
//     }
//     prompt() {
//   let baseClassification = client.getMessagePart().classification.base_type.value
//   if (baseClassification === 'affirmative') {
//     client.updateConversationState({
//       checkIfAfirmative: true,
//     })
//     return 'init.proceed' // `next` from this step will get called
//   } else if (baseClassification === 'decline') {
//     client.updateConversationState({
//       checkIfAfirmative: false,
//     })
//     return 'init.proceed' // `next` from this step will get called
//   }
//
//   client.addResponse('app:response:name:ask_over_eighteen')
//
//   // If the next message is a 'decline', like 'don't know'
//   // or an 'affirmative', like 'yeah', or 'that's right'
//   // then the current stream will be returned to
//   client.expect(client.getStreamName(), ['affirmative', 'decline'])
//   client.done()
// }
// })
//
// client.runFlow({
//   streams: {
//     main: 'showContent',
//     showContent: [checkIfAfirmative],
//     afirmativeGoing: [goingToCES],
//     afirmativeNotGoing: [notGoingToCES],
//   }
// })
// }


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

  const handleGreeting = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addTextResponse('Hello, and welcome to Hack CES!')
      client.done()
    }
  })

  const handleGoodbye = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addTextResponse('See you later!')
      client.done()
    }
  })

  client.runFlow({
    classifications: {
      goodbye: 'goodbye',
      greeting: 'greeting'
    },
    streams: {
      goodbye: handleGoodbye,
      greeting: handleGreeting,
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained]
    }
  })
}
