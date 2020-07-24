import * as TYPES from '../types/types'

const MCAST_ADDR = '239.255.255.250'
const MCAST_PORT = 1982
const MY_PORT = 1983

const dgram = require('react-native-udp')
const socket = dgram.createSocket({type: 'udp4', reuseAddr: true, reusePort: MY_PORT})

socket.on('listening', (err) => {
  if (err) {
    console.log(err)
  }
  console.log('socket listening')
  const address = socket.address()
})

socket.bind(MY_PORT, '0.0.0.0', (err) => {
  socket.addMembership(MCAST_ADDR)
  if (err) {
    console.log(err)
  }
})

const toByteArray = (str) => {
  const bytes = []
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i))
  }
  return bytes
}

const net = require('react-native-tcp')
const client = {}

export const executeCommandOnDevice = (device, command) => {
  if (typeof client[device.ip] !== 'undefined') {
    client[device.ip].write(command, 'utf8', () => {
      console.log('sent')
    })
  }
}

export const addDevice = (device) => {
  return dispatch => {
    dispatch({
      type: TYPES.ADD_DEVICE,
      payload: device
    })  
  }
}

export const discoverDevices = () => {
  return dispatch => {
    socket.on('message', (msg, rinfo) => {
      const target = 'yeelight://'
      const response = String.fromCharCode.apply(null, msg)
      const properties = response.split(/\r?\n/g)
      const _properties = {}
      properties.forEach(property => {
        const delim = property.indexOf(':')
        if (delim >= 0) {
          const key = property.substr(0, delim)
          const value = property.substr(delim + 1, property.length).trim()
          if (key === 'Location') {
            const url_parts = value.split(':')
            if (typeof url_parts !== 'undefined' && url_parts.length > 2) {
              const scheme = url_parts[0] + '://'
              const ip = url_parts[1].substr(2, url_parts[1].length)
              const port = url_parts[2]
              _properties['scheme'] = scheme
              _properties['ip'] = ip
              _properties['port'] = parseInt(port)
            }
          }
          if (key === 'support') {
            const support = value.split(' ')
            _properties['support'] = support
          } else {
            _properties[key] = Number.isInteger(parseInt(value))?parseInt(value):value
          }
        }
      })

      // connect to devices with TCP
      if (typeof client[_properties.ip] === 'undefined') {
        client[_properties.ip] = new net.Socket()
        const _client = client[_properties.ip]
        _client.connect(_properties.port, _properties.ip)
        _client.on('close', () => {
          delete client[_properties.ip]
        })
        _client.on('data', (data) => {
          const res = String.fromCharCode.apply(null, data)
          try {
            const json = JSON.parse(data)
            console.log(json)
            if (typeof json.method !== 'undefined' && json.method === 'props') {
              if (typeof json.params !== 'undefined') {
                dispatch({ type: TYPES.UPDATE_DEVICE, payload: {ip: _properties.ip, params: json.params}})
              }
            }
          } catch (e) {
            console.log(e)
          }
        })
        _client.on('connect', () => {
          console.log('connected: ', _properties.ip, _properties.port)
        })
      }
      dispatch({ type: TYPES.ADD_DEVICE, payload : _properties})
    })
    const message = toByteArray('M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1982\r\nMAN: "ssdp:discover"\r\nST: wifi_bulb\r\n')
    socket.send(message, 0, message.length, MCAST_PORT, MCAST_ADDR, (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
}