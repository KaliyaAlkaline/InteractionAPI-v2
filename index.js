const fs = require("fs")
const zlib = require("zlib")
const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
const path = `${process.env.LOCALAPPDATA}/cache.iapi`
const UZip = {
	compress: (text, loop=1) => {
		text = text.toString()
		let result = zlib.gzipSync(text).toString("base64").replace(/=/g, "")
		if (new Blob([text]).size > new Blob([result]).size) {
			return UZip.compress(result, loop + 1)
		}
		else {
			let final = ""
			if (loop > 1) {
				for (let i = 0; i < text.length; i++) {
					let char = text.charAt(i)
					let offset = 0
					if (char === text.charAt(i + 1)) {
						offset += b64.length
						i++
					}
					final += String.fromCharCode(b64.indexOf(char) + offset)
				}
			}
			else final = text
			let bin = 0
			for (let i = 0; i < final.length; i++) {
				if (final.charCodeAt(0) >= 128) bin++
			}
			if (!bin) {
				let truncate = ""
				for (let i = 0; i < final.length; i++) {
					let offset = 0
					let char = ""
					let edit = ""
					if (final.charAt(i) === final.charAt(i + 1) && final.charAt(i) === final.charAt(i + 2)) {
						char = final.charAt(i)
					}
					while (final.charAt(i) === char) {
						offset++
						i++
					}
					if (offset > 1) {
						offset--
						edit = String.fromCharCode(128 + offset) + char
					}
					truncate += edit + final.charAt(i)
				}
				final = truncate
			}
			return String.fromCharCode(bin) + final + String.fromCharCode(loop - 1)
		}
	},
	decompress: (data) => {
		let bin = data.charCodeAt(0)
		let loop = data.slice(-1).charCodeAt(0)
		data = data.slice(1, -1)
		let data_ = ""
		for (let i = 0; i < data.length; i++) {
			let code = data.charCodeAt(i)
			let edit = data.charAt(i)
			if (code >= 128 && !bin) {
				let char = data.charAt(i + 1)
				edit = char.repeat(code - 128)
			}
			data_ += edit
		}
		let result = ""
		for (let i = 0; i < data_.length; i++) {
			let code = data_.charCodeAt(i)
			let offset = 1
			if (code >= b64.length) {
				code -= 64
				offset++
			}
			result += b64.charAt(code).repeat(offset)
		}
		for (let i = 0; i < loop; i++) {
			result = zlib.unzipSync(new Buffer.from(result, "base64")).toString()
		}
		if (loop > 0) return result
		else return data_
	}
}
if (!fs.existsSync(path)) fs.writeFileSync(path, "\u0000{}\u0000", "utf8")
cache = JSON.parse(UZip.decompress(fs.readFileSync(path, "utf8")))
exports.cache = (data) => {
	let key = crypto.randomUUID()
	delete data.channel_id
	delete data.guild_id
	delete data.data.application_command
	delete data.data.type
	delete data.nonce
	delete data.session_id
	for (let k in cache) {
		if (JSON.stringify(cache[k]) === JSON.stringify(data)) key = k
	}
	cache[key] = data
	fs.writeFileSync(path, UZip.compress(JSON.stringify(cache)), "utf8")
	return key
}
exports.remove = (key) => {
	delete cache[key]
	fs.writeFileSync(path, UZip.compress(JSON.stringify(cache)), "utf8")
	return "Interaction removed from cache."
}
exports.post = async (user_token, channel_id, key) => {
	let json = cache[key]
	json.channel_id = channel_id
	json.guild_id = await fetch(`https://discord.com/api/v9/channels/${channel_id}`, {
		headers: {
			"Authorization": user_token,
			"Content-Type": "application/json"
		}
	}).then(async res => {return await res.json().then(res => {return res.guild_id})})
	json.nonce = crypto.randomUUID().slice(0, 32)
	json.session_id = crypto.randomUUID().slice(0, 32)
	let result = await fetch("https://discord.com/api/v9/interactions", {
		headers: {
			"Authorization": user_token,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(json),
		method: "POST"
	}).then(res => {return res})
	return result
}
exports.clear = () => {
	cache = {}
	fs.writeFileSync(path, "\u0000{}\u0000", "utf8")
	return "Cache cleared."
}