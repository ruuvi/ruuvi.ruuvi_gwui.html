import $ from 'jquery'
import { log_wrap, validate_url } from './utils.mjs'
import GuiCheckbox from './gui_checkbox.mjs'
import GuiInputWithValidation from './gui_input_with_validation.mjs'
import GuiInputPasswordWithValidation from './gui_input_password_with_validataion.mjs'
import GuiDiv from './gui_div.mjs'
import GuiText from './gui_text.mjs'
import GuiRadioButton from './gui_radio_button.mjs'
import GuiInputText from './gui_input_text.mjs'
import GuiSectAdvanced from './gui_sect_advanced.mjs'
import GuiButtonBack from './gui_button_back.mjs'
import GuiButton from './gui_button.mjs'
import { GwCfgMqtt } from './gw_cfg_mqtt.mjs'
import gui_loading from './gui_loading.mjs'
import GwStatus from './gw_status.mjs'
import Navigation from './navigation.mjs'

class PageCustomServer {
  /** @type GwCfg */
  #gwCfg

  /** @type Auth */
  #auth

  #section = $('section#page-custom_server')

  #checkbox_use_http_ruuvi = new GuiCheckbox($('#use_http_ruuvi'))

  #checkbox_use_http = new GuiCheckbox($('#use_http'))
  #div_settings_http = new GuiDiv($('#conf-settings-http'))
  #input_http_url = new GuiInputWithValidation($('#http_url'))
  #input_http_user = new GuiInputWithValidation($('#http_user'))
  #input_http_pass = new GuiInputPasswordWithValidation($('#http_pass'))
  #div_http_validation_error = new GuiDiv($('#page-custom_server-http_validation_error'))
  #text_http_validation_error_desc = new GuiText($('#page-custom_server-http_validation_error-desc'))

  #checkbox_use_mqtt = new GuiCheckbox($('#use_mqtt'))
  #div_settings_mqtt = new GuiDiv($('#conf-settings-mqtt'))
  #radio_mqtt_transport = new GuiRadioButton('mqtt_transport')

  /** @type GuiRadioButtonOption */
  #radio_mqtt_transport_TCP
  /** @type GuiRadioButtonOption */
  #radio_mqtt_transport_SSL
  /** @type GuiRadioButtonOption */
  #radio_mqtt_transport_WS
  /** @type GuiRadioButtonOption */
  #radio_mqtt_transport_WSS

  #input_mqtt_server = new GuiInputWithValidation($('#mqtt_server'))
  #input_mqtt_port = new GuiInputWithValidation($('#mqtt_port'))
  #input_mqtt_user = new GuiInputWithValidation($('#mqtt_user'))
  #input_mqtt_pass = new GuiInputPasswordWithValidation($('#mqtt_pass'))
  #div_mqtt_validation_error = new GuiDiv($('#page-custom_server-mqtt_validation_error'))
  #text_mqtt_validation_error_desc = new GuiText($('#page-custom_server-mqtt_validation_error-desc'))
  #input_mqtt_client_id = new GuiInputWithValidation($('#mqtt_client_id'))
  #checkbox_mqtt_disable_retained_messages = new GuiCheckbox($('#mqtt_disable_retained_messages'))
  #text_mqtt_prefix = new GuiText($('#mqtt_prefix'))
  #checkbox_use_mqtt_prefix_ruuvi = new GuiCheckbox($('#use_mqtt_prefix_ruuvi'))
  #checkbox_use_mqtt_prefix_gw_mac = new GuiCheckbox($('#use_mqtt_prefix_gw_mac'))
  #checkbox_use_mqtt_prefix_custom = new GuiCheckbox($('#use_mqtt_prefix_custom'))
  #input_mqtt_prefix_custom = new GuiInputText($('#mqtt_prefix_custom'))
  #div_mqtt_prefix_custom = new GuiDiv($('#mqtt_prefix_custom_div'))

  #radio_statistics = new GuiRadioButton('use_statistics')

  /** @type GuiRadioButtonOption */
  #radio_statistics_use_ruuvi
  /** @type GuiRadioButtonOption */
  #radio_statistics_use_custom
  /** @type GuiRadioButtonOption */
  #radio_statistics_no

  #input_http_stat_url = new GuiInputWithValidation($('#http_stat_url'))
  #input_http_stat_user = new GuiInputWithValidation($('#http_stat_user'))
  #input_http_stat_pass = new GuiInputPasswordWithValidation($('#http_stat_pass'))
  #div_settings_http_stat = new GuiDiv($('#conf-settings-http_stat'))
  #div_http_stat_validation_error = new GuiDiv($('#page-custom_server-http_stat_validation_error'))
  #text_http_stat_validation_error_desc = new GuiText($('#page-custom_server-http_stat_validation_error-desc'))

  #sect_advanced = new GuiSectAdvanced($('#page-custom_server-advanced-button'))

  #button_back = new GuiButtonBack($('#page-custom_server-button-back'))
  #button_check = new GuiButton($('#page-custom_server-button-check'))
  #button_continue = new GuiButton($('#page-custom_server-button-continue'))

  /**
   * constructor
   * @param {GwCfg} gwCfg
   * @param {Auth} auth
   */
  constructor (gwCfg, auth) {
    this.#gwCfg = gwCfg
    this.#auth = auth

    this.#section.bind('onShow', () => this.#onShow())
    this.#section.bind('onHide', () => this.#onHide())

    this.#radio_mqtt_transport_TCP = this.#radio_mqtt_transport.addOption('mqtt_transport_TCP', false)
    this.#radio_mqtt_transport_SSL = this.#radio_mqtt_transport.addOption('mqtt_transport_SSL', false)
    this.#radio_mqtt_transport_WS = this.#radio_mqtt_transport.addOption('mqtt_transport_WS', false)
    this.#radio_mqtt_transport_WSS = this.#radio_mqtt_transport.addOption('mqtt_transport_WSS', false)

    this.#radio_statistics_use_ruuvi = this.#radio_statistics.addOption('statistics_use_ruuvi', false)
    this.#radio_statistics_use_custom = this.#radio_statistics.addOption('statistics_use_custom', false)
    this.#radio_statistics_no = this.#radio_statistics.addOption('statistics_no', false)

    this.#checkbox_use_http_ruuvi.on_change(() => this.#onChangeUseHttpRuuvi())
    this.#checkbox_use_http.on_change(() => this.#onChangeUseHttpCustom())

    this.#radio_statistics_use_ruuvi.on_click(() => this.#onChangeUseStatistics())
    this.#radio_statistics_use_custom.on_click(() => this.#onChangeUseStatistics())
    this.#radio_statistics_no.on_click(() => this.#onChangeUseStatistics())

    this.#input_http_url.on_input_or_change(() => this.#onChangeHttpUrl())
    this.#input_http_user.on_input_or_change(() => this.#onChangeHttpUser())
    this.#input_http_pass.on_input_or_change(() => this.#onChangeHttpPass())

    this.#input_http_stat_url.on_input_or_change(() => this.#onChangeHttpStatUrl())
    this.#input_http_stat_user.on_input_or_change(() => this.#onChangeHttpStatUser())
    this.#input_http_stat_pass.on_input_or_change(() => this.#onChangeHttpStatPass())

    this.#checkbox_use_mqtt.on_change(() => this.#onChangeUseMqtt())
    this.#radio_mqtt_transport_TCP.on_click(() => this.#onChangeMqttTransport())
    this.#radio_mqtt_transport_SSL.on_click(() => this.#onChangeMqttTransport())
    this.#radio_mqtt_transport_WS.on_click(() => this.#onChangeMqttTransport())
    this.#radio_mqtt_transport_WSS.on_click(() => this.#onChangeMqttTransport())

    this.#input_mqtt_server.on_input_or_change(() => this.#onChangeMqttServer())
    this.#input_mqtt_port.on_input_or_change(() => this.#onChangeMqttPort())
    this.#input_mqtt_user.on_input_or_change(() => this.#onChangeMqttUser())
    this.#input_mqtt_pass.on_input_or_change(() => this.#onChangeMqttPass())

    this.#checkbox_use_mqtt_prefix_ruuvi.on_change(() => this.#onChangeUseMqttPrefix())
    this.#checkbox_use_mqtt_prefix_gw_mac.on_change(() => this.#onChangeUseMqttPrefix())
    this.#checkbox_use_mqtt_prefix_custom.on_change(() => this.#onChangeUseMqttPrefix())
    this.#input_mqtt_prefix_custom.on_change(() => this.#onChangeUseMqttPrefix())

    this.#button_check.on_click(() => this.#onButtonCheck())
    this.#button_continue.on_click(() => Navigation.change_url_ntp_config())
  }

  #onShow () {
    console.log(log_wrap('section#page-custom_server: onShow'))

    if (this.#gwCfg.http_stat.is_default()) {
      this.#sect_advanced.hide()
    } else {
      this.#sect_advanced.show()
    }

    this.#checkbox_use_http_ruuvi.setUnchecked()
    this.#checkbox_use_http.setUnchecked()
    if (this.#gwCfg.http.use_http) {
      if (this.#gwCfg.http.is_default()) {
        this.#checkbox_use_http_ruuvi.setChecked()
      } else {
        this.#checkbox_use_http.setChecked()
      }
    }

    this.#input_http_url.setVal(this.#gwCfg.http.http_url)
    this.#input_http_user.setVal(this.#gwCfg.http.http_user)
    if (this.#gwCfg.http.http_pass === undefined) {
      this.#input_http_pass.set_use_saved()
    }

    if (this.#gwCfg.http_stat.use_http_stat) {
      if (this.#gwCfg.http_stat.is_default()) {
        this.#radio_statistics_use_ruuvi.setChecked()
      } else {
        this.#radio_statistics_use_custom.setChecked()
      }
    } else {
      this.#radio_statistics_no.setChecked()
    }

    this.#input_http_stat_url.setVal(this.#gwCfg.http_stat.http_stat_url)
    this.#input_http_stat_user.setVal(this.#gwCfg.http_stat.http_stat_user)
    if (this.#gwCfg.http_stat.http_stat_user === undefined) {
      this.#input_http_stat_pass.set_use_saved()
    }

    this.#checkbox_use_mqtt.setState(this.#gwCfg.mqtt.use_mqtt)
    if (this.#gwCfg.mqtt.mqtt_transport.isTCP()) {
      this.#radio_mqtt_transport_TCP.setChecked()
    } else if (this.#gwCfg.mqtt.mqtt_transport.isSSL()) {
      this.#radio_mqtt_transport_SSL.setChecked()
    } else if (this.#gwCfg.mqtt.mqtt_transport.isWS()) {
      this.#radio_mqtt_transport_WS.setChecked()
    } else if (this.#gwCfg.mqtt.mqtt_transport.isWSS()) {
      this.#radio_mqtt_transport_WSS.setChecked()
    }

    this.#input_mqtt_server.setVal(this.#gwCfg.mqtt.mqtt_server)
    this.#input_mqtt_port.setVal(this.#gwCfg.mqtt.mqtt_port)
    this.#input_mqtt_user.setVal(this.#gwCfg.mqtt.mqtt_user)
    if (this.#gwCfg.mqtt.mqtt_pass === undefined) {
      this.#input_mqtt_pass.set_use_saved()
    }
    if (this.#gwCfg.mqtt.mqtt_client_id) {
      this.#input_mqtt_client_id.setVal(this.#gwCfg.mqtt.mqtt_client_id)
    } else {
      this.#input_mqtt_client_id.setVal(this.#gwCfg.info.gw_mac)
    }

    this.#checkbox_mqtt_disable_retained_messages.setState(this.#gwCfg.mqtt.mqtt_disable_retained_messages)

    if (!this.#gwCfg.mqtt.mqtt_prefix) {
      this.#checkbox_use_mqtt_prefix_ruuvi.setUnchecked()
      this.#checkbox_use_mqtt_prefix_gw_mac.setUnchecked()
      this.#checkbox_use_mqtt_prefix_custom.setUnchecked()
    } else {
      let start_idx = 0
      let prefix_ruuvi = 'ruuvi'
      let mqtt_topic = this.#gwCfg.mqtt.mqtt_prefix
      if ((mqtt_topic === prefix_ruuvi) || mqtt_topic.startsWith(prefix_ruuvi + '/')) {
        this.#checkbox_use_mqtt_prefix_ruuvi.setChecked()
        start_idx = prefix_ruuvi.length
        if (mqtt_topic[start_idx] === '/') {
          start_idx += 1
        }
      } else {
        this.#checkbox_use_mqtt_prefix_ruuvi.setUnchecked()
      }
      mqtt_topic = mqtt_topic.substring(start_idx)
      start_idx = 0
      if ((mqtt_topic === this.#gwCfg.info.gw_mac) || mqtt_topic.startsWith(this.#gwCfg.info.gw_mac + '/')) {
        this.#checkbox_use_mqtt_prefix_gw_mac.setChecked()
        start_idx = this.#gwCfg.info.gw_mac.length
        if (mqtt_topic[start_idx] === '/') {
          start_idx += 1
        }
      } else {
        this.#checkbox_use_mqtt_prefix_gw_mac.setUnchecked()
      }
      mqtt_topic = mqtt_topic.substring(start_idx)
      if (mqtt_topic.length > 0) {
        if (mqtt_topic.slice(-1) === '/') {
          if (mqtt_topic.length > 1) {
            if (/[a-zA-Z0-9]/.test(mqtt_topic.slice(-2, -1))) {
              mqtt_topic = mqtt_topic.slice(0, -1)
            }
          }
        }
      }
      this.#input_mqtt_prefix_custom.setVal(mqtt_topic)
      if (mqtt_topic.length > 0) {
        this.#checkbox_use_mqtt_prefix_custom.setChecked()
      } else {
        this.#checkbox_use_mqtt_prefix_custom.setUnchecked()
      }
    }

    this.#on_custom_connection_type_changed()
    this.#on_custom_server_url_changed()
    this.#on_edit_mqtt_settings()
  }

  #onHide () {
    console.log(log_wrap('section#page-custom_server: onHide'))
    if (this.#checkbox_use_http_ruuvi.isChecked()) {
      this.#gwCfg.http.set_default()
    } else if (this.#checkbox_use_http.isChecked()) {
      this.#gwCfg.http.use_http = true
      this.#gwCfg.http.http_url = this.#input_http_url.getVal()
      this.#gwCfg.http.http_user = this.#input_http_user.getVal()
      if (!this.#input_http_pass.is_saved()) {
        this.#gwCfg.http.http_pass = this.#input_http_pass.getVal()
      }
    } else {
      this.#gwCfg.http.use_http = false
      this.#gwCfg.http.http_url = ''
      this.#gwCfg.http.http_user = ''
      this.#gwCfg.http.http_pass = ''
    }

    if (this.#radio_statistics_use_ruuvi.isChecked()) {
      this.#gwCfg.http_stat.set_default()
    } else if (this.#radio_statistics_use_custom.isChecked()) {
      this.#gwCfg.http_stat.use_http_stat = true
      this.#gwCfg.http_stat.http_stat_url = this.#input_http_stat_url.getVal()
      this.#gwCfg.http_stat.http_stat_user = this.#input_http_stat_user.getVal()
      if (!this.#input_http_stat_pass.is_saved()) {
        this.#gwCfg.http_stat.http_stat_pass = this.#input_http_stat_pass.getVal()
      }
    } else {
      this.#gwCfg.http_stat.use_http_stat = false
      this.#gwCfg.http_stat.http_stat_url = ''
      this.#gwCfg.http_stat.http_stat_user = ''
      this.#gwCfg.http_stat.http_stat_pass = ''
    }

    if (this.#checkbox_use_mqtt.isChecked()) {
      this.#gwCfg.mqtt.use_mqtt = true
      this.#gwCfg.mqtt.mqtt_disable_retained_messages = this.#checkbox_mqtt_disable_retained_messages.isChecked()
      if (this.#radio_mqtt_transport_TCP.isChecked()) {
        this.#gwCfg.mqtt.mqtt_transport.setTCP()
      } else if (this.#radio_mqtt_transport_SSL.isChecked()) {
        this.#gwCfg.mqtt.mqtt_transport.setSSL()
      } else if (this.#radio_mqtt_transport_WS.isChecked()) {
        this.#gwCfg.mqtt.mqtt_transport.setWS()
      } else if (this.#radio_mqtt_transport_WSS.isChecked()) {
        this.#gwCfg.mqtt.mqtt_transport.setWSS()
      } else {
        throw new Error('Unsupported MQTT transport')
      }
      this.#gwCfg.mqtt.mqtt_server = this.#input_mqtt_server.getVal()
      this.#gwCfg.mqtt.mqtt_port = parseInt(this.#input_mqtt_port.getVal())
      if (Number.isNaN(this.#gwCfg.mqtt.mqtt_port)) {
        this.#gwCfg.mqtt.mqtt_port = 0
      }
      this.#gwCfg.mqtt.mqtt_user = this.#input_mqtt_user.getVal()
      if (!this.#input_mqtt_pass.is_saved()) {
        this.#gwCfg.mqtt.mqtt_pass = this.#input_mqtt_pass.getVal()
      }
      this.#gwCfg.mqtt.mqtt_prefix = this.#get_mqtt_topic_prefix()
      this.#gwCfg.mqtt.mqtt_client_id = this.#input_mqtt_client_id.getVal()
      if (!this.#gwCfg.mqtt.mqtt_client_id) {
        this.#gwCfg.mqtt.mqtt_client_id = this.#gwCfg.info.gw_mac
      }
    } else {
      this.#gwCfg.mqtt.set_default()
      this.#gwCfg.mqtt.use_mqtt = false
    }
  }

  #onChangeUseHttpRuuvi () {
    this.#on_custom_connection_type_changed()
    this.#on_custom_server_url_changed()
  }

  #onChangeUseHttpCustom () {
    if (this.#checkbox_use_http.isChecked()) {
      this.#input_http_url.setVal('')
      this.#input_http_url.setValidationRequired()
    }
    this.#on_custom_connection_type_changed()
    this.#on_custom_server_url_changed()
  }

  #onChangeUseStatistics () {
    if (this.#radio_statistics_use_custom.isChecked()) {
      this.#div_settings_http_stat.show()
      this.#input_http_stat_url.setVal('')
      this.#input_http_stat_user.setVal('')
      this.#input_http_stat_pass.clear()
      this.#input_http_stat_url.setValidationRequired()
    } else {
      this.#div_settings_http_stat.show()
    }
    this.#on_custom_server_url_changed()
  }

  #onChangeHttpUrl () {
    this.#input_http_url.setValidationRequired()
    this.#on_custom_server_url_changed()
  }

  #onChangeHttpUser () {
    this.#input_http_pass.clear_saved()
    this.#input_http_url.setValidationRequired()
    this.#on_custom_server_url_changed()
  }

  #onChangeHttpPass () {
    this.#input_http_pass.clear_saved()
    this.#input_http_url.setValidationRequired()
    this.#on_custom_server_url_changed()
  }

  #onChangeHttpStatUrl () {
    this.#input_http_stat_url.setValidationRequired()
    this.#on_custom_server_url_changed()
  }

  #onChangeHttpStatUser () {
    this.#input_http_pass.clear_saved()
    this.#input_http_stat_url.setValidationRequired()
    this.#on_custom_server_url_changed()
  }

  #onChangeHttpStatPass () {
    this.#input_http_pass.clear_saved()
    this.#input_http_stat_url.setValidationRequired()
    this.#on_custom_server_url_changed()
  }

  #onChangeUseMqtt () {
    if (this.#checkbox_use_mqtt.isChecked()) {
      this.#input_mqtt_server.setValidationRequired()
    } else {
      this.#input_mqtt_server.clearValidationRequired()
    }
    this.#on_custom_connection_type_changed()
    this.#on_custom_server_url_changed()
  }

  #onChangeMqttTransport () {
    // let mqtt_transport = $('input[name=\'mqtt_transport\']:checked').val()
    const is_mqtt_authentication_used = this.#input_mqtt_user.getVal() !== ''
    let default_port = 1883
    if (this.#radio_mqtt_transport_TCP.isChecked()) {
      if (is_mqtt_authentication_used) {
        default_port = 1884
      } else {
        default_port = 1883
      }
    } else if (this.#radio_mqtt_transport_SSL.isChecked()) {
      if (is_mqtt_authentication_used) {
        default_port = 8885
      } else {
        default_port = 8886
      }
    } else if (this.#radio_mqtt_transport_WS.isChecked()) {
      if (is_mqtt_authentication_used) {
        default_port = 8090
      } else {
        default_port = 8080
      }
    } else if (this.#radio_mqtt_transport_WSS.isChecked()) {
      if (is_mqtt_authentication_used) {
        default_port = 8091
      } else {
        default_port = 8081
      }
    }
    if (this.#input_mqtt_server.getVal() === GwCfgMqtt.MQTT_SERVER_DEFAULT) {
      this.#input_mqtt_port.setVal(default_port)
      if (is_mqtt_authentication_used) {
        this.#input_mqtt_user.setVal('rw')
        this.#input_mqtt_pass.setVal('readwrite')
      } else {
        this.#input_mqtt_pass.clear()
      }
      this.#input_mqtt_pass.clear_saved()
    }
    this.#input_mqtt_server.setValidationRequired()
    this.#on_custom_server_url_changed()
  }

  #onChangeMqttServer () {
    this.#on_edit_mqtt_settings()
    this.#input_mqtt_server.setValidationRequired()
    this.#on_custom_server_url_changed()
  }

  #onChangeMqttPort () {
    this.#on_edit_mqtt_settings()
    this.#input_mqtt_server.setValidationRequired()
    this.#on_custom_server_url_changed()
  }

  #onChangeMqttUser () {
    this.#input_mqtt_pass.clear_saved()
    this.#on_edit_mqtt_settings()
    this.#input_mqtt_server.setValidationRequired()
    this.#on_custom_server_url_changed()
  }

  #onChangeMqttPass () {
    this.#input_mqtt_pass.clear_saved()
    this.#on_edit_mqtt_settings()
    this.#input_mqtt_server.setValidationRequired()
    this.#on_custom_server_url_changed()
  }

  #onChangeUseMqttPrefix () {
    if (this.#checkbox_use_mqtt_prefix_custom.isChecked()) {
      this.#div_mqtt_prefix_custom.show()
    } else {
      this.#div_mqtt_prefix_custom.hide()
    }
    this.#on_edit_mqtt_settings()
  }

  #onButtonCheck () {
    if (!this.#input_http_url.getVal().startsWith('http://') && !this.#input_http_url.getVal().startsWith('https://')) {
      this.#input_http_url.setVal('http://' + this.#input_http_url.getVal())
      this.#input_http_url.setValidationRequired()
    }
    if (this.#input_http_url.isInvalid() || this.#input_http_url.isValidationRequired()) {
      this.#input_http_url.clearValidationIcon()
      this.#input_http_url.clearValidationIcon()
      this.#input_http_url.setValidationRequired()
      this.#input_http_user.clearValidationIcon()
      this.#input_http_pass.clearValidationIcon()
    }

    if (!this.#input_http_stat_url.getVal().startsWith('http://') && !this.#input_http_stat_url.getVal().startsWith('https://')) {
      this.#input_http_stat_url.setVal('http://' + this.#input_http_stat_url.getVal())
      this.#input_http_stat_url.setValidationRequired()
    }
    if (this.#input_http_stat_url.isInvalid() || this.#input_http_stat_url.isValidationRequired()) {
      this.#input_http_stat_url.clearValidationIcon()
      this.#input_http_stat_url.setValidationRequired()
      this.#input_http_stat_user.clearValidationIcon()
      this.#input_http_stat_pass.clearValidationIcon()
    }

    if (this.#input_mqtt_server.isInvalid() || this.#input_mqtt_server.isValidationRequired()) {
      this.#input_mqtt_server.clearValidationIcon()
      this.#input_mqtt_server.setValidationRequired()
      this.#input_http_stat_user.clearValidationIcon()
      this.#input_http_stat_pass.clearValidationIcon()
    }

    this.#custom_server_validate_urls()
  }

  #on_custom_connection_type_changed () {
    if (this.#checkbox_use_http.isChecked()) {
      this.#div_settings_http.show()
      this.#checkbox_use_http_ruuvi.disable()
    } else {
      this.#div_settings_http.hide()
      this.#checkbox_use_http_ruuvi.enable()
    }
    if (this.#checkbox_use_http_ruuvi.isChecked()) {
      this.#checkbox_use_http.disable()
    } else {
      this.#checkbox_use_http.enable()
    }

    if (this.#checkbox_use_mqtt) {
      this.#div_settings_mqtt.show()
    } else {
      this.#div_settings_mqtt.hide()
    }

    if (this.#radio_statistics_use_custom.isChecked()) {
      this.#div_settings_http_stat.show()
    } else {
      this.#div_settings_http_stat.hide()
    }

    if (this.#checkbox_use_mqtt.isChecked()) {
      this.#div_settings_mqtt.show()
    } else {
      this.#div_settings_mqtt.hide()
    }
  }

  #on_custom_server_url_changed () {
    let flag_url_modified = false

    if (this.#checkbox_use_http.isChecked() && this.#input_http_url.isValidationRequired()) {
      flag_url_modified = true
      this.#input_http_url.clearValidationIcon()
      this.#input_http_user.clearValidationIcon()
      this.#input_http_pass.clearValidationIcon()
    }

    if (this.#radio_statistics_use_custom.isChecked() && this.#input_http_stat_url.isValidationRequired()) {
      flag_url_modified = true
      this.#input_http_stat_url.clearValidationIcon()
      this.#input_http_stat_user.clearValidationIcon()
      this.#input_http_stat_pass.clearValidationIcon()
    }

    if (this.#checkbox_use_mqtt.isChecked() && this.#input_mqtt_server.isValidationRequired()) {
      flag_url_modified = true
      this.#input_mqtt_server.clearValidationIcon()
      this.#input_mqtt_user.clearValidationIcon()
      this.#input_mqtt_pass.clearValidationIcon()
    }

    if (flag_url_modified || this.#input_http_url.isInvalid() || this.#input_http_stat_url.isInvalid() ||
        this.#input_mqtt_server.isInvalid()) {
      this.#button_continue.disable()
      this.#button_check.enable()
    } else {
      this.#button_continue.enable()
      this.#button_check.disable()
    }
  }

  #get_mqtt_topic_prefix () {
    let mqtt_topic = ''

    if (this.#checkbox_use_mqtt_prefix_ruuvi.isChecked()) {
      mqtt_topic += 'ruuvi'
    }
    if (this.#checkbox_use_mqtt_prefix_gw_mac.isChecked()) {
      if (mqtt_topic.length > 0) {
        mqtt_topic += '/'
      }
      mqtt_topic += this.#gwCfg.info.gw_mac
    }
    let flag_add_trailing_slash = mqtt_topic.length > 0
    if (this.#checkbox_use_mqtt_prefix_custom.isChecked()) {
      let mqtt_prefix_custom = this.#input_mqtt_prefix_custom.getVal()
      if (mqtt_prefix_custom.length > 0) {
        flag_add_trailing_slash = /[a-zA-Z0-9]/.test(mqtt_prefix_custom.slice(-1))
        if (mqtt_topic.length > 0) {
          mqtt_topic += '/'
        }
        let suffix_len = flag_add_trailing_slash ? 1 : 0
        if ((mqtt_topic.length + mqtt_prefix_custom.length + suffix_len) >= GwCfgMqtt.MQTT_PREFIX_MAX_LENGTH) {
          if (mqtt_topic.length >= GwCfgMqtt.MQTT_PREFIX_MAX_LENGTH) {
            mqtt_prefix_custom = ''
          } else {
            mqtt_prefix_custom = mqtt_prefix_custom.substring(0, GwCfgMqtt.MQTT_PREFIX_MAX_LENGTH - mqtt_topic.length - suffix_len)
          }
          this.#input_mqtt_prefix_custom.setVal(mqtt_prefix_custom)
        }
        mqtt_topic += mqtt_prefix_custom
      }
    }
    if (flag_add_trailing_slash) {
      mqtt_topic += '/'
    }
    return mqtt_topic
  }

  #on_edit_mqtt_settings () {
    let mqtt_prefix = this.#get_mqtt_topic_prefix()
    mqtt_prefix += '<SENSOR_MAC_ADDRESS>'

    this.#text_mqtt_prefix.setVal(mqtt_prefix)
  }

  #custom_server_validate_urls () {
    console.log('custom_server_validate_urls')
    gui_loading.bodyClassLoadingAdd()
    GwStatus.stopCheckingStatus()

    this.#custom_server_validate_url_http()
        .then(() => this.#custom_server_validate_url_http_stat())
        .then(() => this.#custom_server_validate_url_mqtt())
        .finally(() => {
          this.#on_custom_server_url_changed()
          this.#button_continue.enable()
          gui_loading.bodyClassLoadingRemove()
          GwStatus.startCheckingStatus()
        })
  }

  #custom_server_validate_url_http () {
    if (this.#checkbox_use_http_ruuvi.isChecked()) {
      console.log(log_wrap(`HTTP URL validation not needed (Ruuvi server is used)`))
      return new Promise(function (resolve) {
        resolve(true)
      })
    }

    if (!this.#checkbox_use_http.isChecked()) {
      console.log(log_wrap(`HTTP URL validation not needed (HTTP is not active)`))
      return new Promise(function (resolve) {
        resolve(true)
      })
    }

    let auth_type = 'none'
    if (this.#input_http_user.getVal() !== '') {
      auth_type = 'basic'
    }

    return validate_url(this.#auth, this.#input_http_url.getVal(), 'check_post_advs', auth_type, {
      input_url: this.#input_http_url,
      input_user: this.#input_http_user,
      input_pass: this.#input_http_pass,
      error: this.#text_http_validation_error_desc,
      div_status: this.#div_http_validation_error,
    })
  }

  #custom_server_validate_url_http_stat () {
    if (this.#radio_statistics_no.isChecked()) {
      console.log(log_wrap(`HTTP_STAT URL validation not needed (HTTP_STAT is not used)`))
      return new Promise(function (resolve) {
        resolve(true)
      })
    }
    if (this.#radio_statistics_use_ruuvi.isChecked()) {
      console.log(log_wrap(`HTTP_STAT URL validation not needed (Ruuvi server is used)`))
      return new Promise(function (resolve) {
        resolve(true)
      })
    }

    if (!this.#radio_statistics_use_custom.isChecked()) {
      console.log(log_wrap(`HTTP_STAT URL validation not needed (HTTP_STAT is not active)`))
      return new Promise(function (resolve) {
        resolve(true)
      })
    }

    let auth_type = 'none'
    if (this.#input_http_stat_user.getVal() !== '') {
      auth_type = 'basic'
    }

    return validate_url(this.#auth, this.#input_http_stat_url.getVal(), 'check_post_stat', auth_type, {
      input_url: this.#input_http_stat_url,
      input_user: this.#input_http_stat_user,
      input_pass: this.#input_http_stat_pass,
      error: this.#text_http_stat_validation_error_desc,
      div_status: this.#div_http_stat_validation_error,
    })
  }

  #custom_server_validate_url_mqtt () {
    if (!this.#checkbox_use_mqtt.isChecked()) {
      console.log(log_wrap(`MQTT URL validation not needed (MQTT is not active)`))
      return new Promise(function (resolve) {
        resolve(true)
      })
    }
    let mqtt_url_prefix = ''
    if (this.#radio_mqtt_transport_TCP.isChecked()) {
      mqtt_url_prefix = 'mqtt://'
    } else if (this.#radio_mqtt_transport_SSL.isChecked()) {
      mqtt_url_prefix = 'mqtts://'
    } else if (this.#radio_mqtt_transport_WS.isChecked()) {
      mqtt_url_prefix = 'mqttws://'
    } else if (this.#radio_mqtt_transport_WSS.isChecked()) {
      mqtt_url_prefix = 'mqttwss://'
    }
    let mqtt_topic_prefix = this.#get_mqtt_topic_prefix()
    let mqtt_url = mqtt_url_prefix + this.#input_mqtt_server.getVal() + ':' + this.#input_mqtt_port.getVal()
    let aux_params = ''
    aux_params += '&mqtt_topic_prefix='
    aux_params += encodeURIComponent(mqtt_topic_prefix)
    aux_params += '&mqtt_client_id='
    aux_params += encodeURIComponent(this.#input_mqtt_client_id.getVal())

    let auth_type = 'none'
    if (this.#input_mqtt_user.getVal() !== '') {
      auth_type = 'basic'
    }

    return validate_url(this.#auth, mqtt_url, 'check_mqtt', auth_type, {
      input_url: this.#input_mqtt_server,
      input_user: this.#input_mqtt_user,
      input_pass: this.#input_mqtt_pass,
      aux_params: aux_params,
      error: this.#text_mqtt_validation_error_desc,
      div_status: this.#div_mqtt_validation_error,
    })
  }
}

export default PageCustomServer