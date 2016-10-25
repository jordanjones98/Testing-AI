'use strict'

exports.handle = function handle(client) {
const showStuffCES = client.createStep({
    satisfied() {
        return false
    },
    prompt() {
        client.addTextResponse('Awesome!')
        client.done()
    }
})

const noShowStuffCES = client.createStep({
    satisfied() {
        return false
    },
    prompt() {
        client.addTextResponse('Thats too bad..')
        client.done()
    }
})

const checkIfGoingToCES = client.createStep({
  satisfied() {
    return (typeof client.getConversationState().isGoingToCES !== 'undefined')
  },

  next() {
    const isGoing = client.getConversationState().isGoingToCES
    if (isGoing === true) {
        return 'showCES'
    } else if (isGoing === false) {
        return 'noShowCES'
    }
},

  prompt() {
    let baseClassification = client.getMessagePart().classification.base_type.value
    if (baseClassification === 'affirmative') {
      client.updateConversationState({
        isGoingToCES: true,
      })
      return 'init.proceed' // `next` from this step will get called
    } else if (baseClassification === 'decline') {
      client.updateConversationState({
        isGoingToCES: false,
      })
      return 'init.proceed' // `next` from this step will get called
    }

    client.addTextResponse('Hey! are you going to CES?')

    // If the next message is a 'decline', like 'don't know'
    // or an 'affirmative', like 'yeah', or 'that's right'
    // then the current stream will be returned to
    client.expect(client.getStreamName(), ['affirmative', 'decline'])
    client.done()
  }
})

client.runFlow({
  streams: {
    main: 'showContent',
    showContent: [checkIfGoingToCES],
    showCES: [showStuffCES],
    noShowCES: [noShowStuffCES],
  }
})

}
//
    // WORKING CODE UNDER HERE
//
// 'use strict'
//
// exports.handle = function handle(client) {
//   // const sayHello = client.createStep({
//   //   satisfied() {
//   //     return Boolean(client.getConversationState().helloSent)
//   //   },
//   //
//   //   prompt() {
//   //     client.addResponse('app:response:name:welcome')
//   //     client.addResponse('app:response:name:provide/documentation', {
//   //       documentation_link: 'http://docs.init.ai',
//   //     })
//   //     client.addResponse('app:response:name:provide/instructions')
//   //     client.updateConversationState({
//   //       helloSent: true
//   //     })
//   //     client.done()
//   //   }
//   // })
//
//   // const untrained = client.createStep({
//   //   satisfied() {
//   //     return false
//   //   },
//   //
//   //   prompt() {
//   //     client.addResponse('app:response:name:apology/untrained')
//   //     client.done()
//   //   }
//   // })
//
//   const handleGreeting = client.createStep({
//     satisfied() {
//       return false
//     },
//
//     prompt() {
//       client.addTextResponse('Hello, and welcome to Hack CES!')
//       client.addTextResponse('Are you going to CES this January?')
//       client.done()
//     }
//   })
//
//   const handleGoodbye = client.createStep({
//     satisfied() {
//       return false
//     },
//
//     prompt() {
//       client.addTextResponse('See you later!')
//       client.done()
//     }
//   })
//
//   // Yes No
//   const afirmativeGoing = client.createStep({
//       satisfied() {
//           return false
//       },
//
//       prompt() {
//           client.addTextResponse('Awesome! We\'re glad you\'re going!')
//       }
//   })
//
//   const negativeGoing = client.createStep({
//       satisfied() {
//           return false
//       },
//
//       prompt() {
//           client.addTextResponse('That\'s to bad. You can check it out by clicking this link! https://www.ces.tech/')
//       }
//   })
//
//   client.runFlow({
//     classifications: {
//       goodbye: 'goodbye',
//       greeting: 'greeting',
//     },
//     streams: {
//       goodbye: handleGoodbye,
//       greeting: handleGreeting,
//     }
//   })
// }
