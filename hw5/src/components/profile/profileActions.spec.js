import { expect } from 'chai'
import mockery from 'mockery'
import fetch, { mock } from 'mock-fetch'

let resource, profileActions, url
describe('Test profileActions', () => {

    beforeEach(() => {
        if (mockery.enable) {
            mockery.enable({warnOnUnregistered: false, useCleanCache:true})
            mockery.registerMock('node-fetch', fetch)
            require('node-fetch')
            url = require('../../actions').url
            resource = require('../../actions').resource
            profileActions = require('./profileActions')
        }
    })

    afterEach(() => {
        if (mockery.enable) {
            mockery.deregisterMock('node-fetch')
            mockery.disable()
        } 
    })  

    it('should update the headline', (done)=>{

        const username = 'someuser'
        const headline = 'a new headline'

        mock(`${url}/headline`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            json: {username, headline}
        })
        
        profileActions.updateHeadline('does not matter')(
            fn => fn(action => {
            expect(action).to.eql({ 
                headline, type: 'UPDATE_PROFILE'
            })
            done()
        }))
    })

    it('should fetch the profile', (done)=>{

        const avatar = 'img'
        const zipcode = '12345'
        const email = 'abc@abc.abc'
        const dob = '123456'

        mock(`${url}/avatars`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            json: {avatars: [{avatar}]}
        })

        mock(`${url}/zipcode`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            json: {zipcode}
        })

        mock(`${url}/email`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            json: {email}
        })

        mock(`${url}/dob`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            json: {dob}
        })


        var callCount = 0
        profileActions.fetchProfile()(
            fn => fn((action) =>{
                if (callCount == 0){
                    expect(action).to.eql({
                        image:avatar, type:'UPDATE_PROFILE'
                    })
                    callCount++
                                        
                }
                else if (callCount == 1){
                    expect(action).to.eql({
                        zipcode, type:'UPDATE_PROFILE'
                    })
                    callCount++
                }
                else if (callCount == 2){
                    expect(action).to.eql({
                        email, type:'UPDATE_PROFILE'
                    })
                    callCount++
                }
                else if (callCount == 3){
                    expect(action).to.eql({
                        dob, type:'UPDATE_PROFILE'
                    })
                    callCount++
                    done()
                }
            })
            
        )



    })

})
