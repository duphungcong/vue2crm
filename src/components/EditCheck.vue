<template>
  <v-container fluid grid-list-sm>
    <v-flex sx12>
      <v-card class="elevation-0">
        <v-data-table :headers="headers" :items="workpack" :pagination.sync="pagination">
          <template slot="items" slot-scope="props" class="body-2">
            <td class="body-0">{{ props.item.wpItem }}</td>
            <!-- <td class="body-0">{{ props.item.taskName }}</td> -->
            <td class="body-0">{{ props.item.zone }}</td>
            <!-- <td class="body-0">{{ props.item.taskType }}</td> -->
            <td class="body-0">{{ props.item.taskTitle }}</td>
            <!-- <td class="body-0">{{ props.item.amsMH }}</td>
            <td class="body-0">{{ props.item.macMH }}</td>
            <td class="body-0">{{ props.item.men }}</td>
            <td class="body-0">{{ props.item.hour }}</td> -->
            <td class="body-0">{{ props.item.zoneDivision }}</td>
            <!-- <td class="body-0">{{ props.item.remarks }}</td> -->
            <td class=justify-center layout px-0>
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="linkItem(props.item)" :disabled="!props.item.taskName.includes('VN ')">
                <v-icon color="teal">link</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
    <loading-progress></loading-progress>
    <v-dialog v-model="dialogEditItem" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Item</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="AMS MH" v-model="editedItem.amsMH"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="MAC MH" v-model="editedItem.macMH"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="MEN" v-model="editedItem.men"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="HOUR" v-model="editedItem.hour"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field multi-line rows="2" label="ZONE DIVISION" v-model="editedItem.zoneDivision"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field multi-line rows="2" no-resize label="REMARKS" v-model="editedItem.remarks"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="closeEditItem()">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="saveEditItem()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogLinkItem" max-width="500">
      <v-card>
        <v-card-title><span class="headline">Link to EO</span></v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                 <v-text-field disabled label="TITLE" v-model="editedItem.taskTitle"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-select clearable open-on-clear :items="eoList" label="Select EO" v-model="linkedItem" item-text="name" class="input-group--focused" required autocomplete @keyup.native.enter="addEO"></v-select>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="AMS MH" v-model="linkedItem.amsMH"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="MAC MH" v-model="linkedItem.macMH"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="MEN" v-model="linkedItem.men"></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 md3>
                <v-text-field type="number" label="HOUR" v-model="linkedItem.hour"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="ZONE DIVISION" v-model="linkedItem.zoneDivision"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="REMARKS" v-model="linkedItem.remarks"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="closeLinkItem()">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="saveLinkItem()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'EditCheck',
  data () {
    return {
      checkId: null,
      check: {},
      workpack: [],
      eoList: [],
      pagination: {
        page: 1,
        totalItems: 0,
        rowsPerPage: 10
      },
      headers: [
        { text: 'WP ITEM', left: true, value: 'wpItem' },
        // { text: 'TASK', left: true, value: 'taskName' },
        { text: 'ZONE', left: true, value: 'zone' },
        // { text: 'TYPE', left: true, value: 'taskType' },
        { text: 'TITLE', left: true, value: 'taskTitle' },
        // { text: 'AMS MH', left: true, value: 'amsMH' },
        // { text: 'MAC MH', left: true, value: 'macMH' },
        // { text: 'MEN', left: true, value: 'men' },
        // { text: 'HOUR', left: true, value: 'hour' },
        { text: 'ZONE DIVISION', left: true, value: 'zoneDivision' },
        // { text: 'REMARK', left: true, value: 'remarks' },
        { text: '', sortable: false, value: '' }
      ],
      itemIndex: -1,
      defaultItem: {
        amsMH: 0,
        macMH: 0,
        men: 0,
        hour: 0,
        zoneDivision: 'N/A',
        remarks: 'NIL'
      },
      editedItem: {},
      linkedItem: {},
      dialogEditItem: false,
      dialogLinkItem: false
    }
  },
  watch: {
    linkedItem (newVal, oldVal) {
      if (newVal === null) {
        this.linkedItem = {}
      }
    }
  },
  methods: {
    loadCheck() {
      firebase.database().ref('checks').child(this.checkId).once('value').then(
        (data) => {
          this.check = data.val()
        },
        (error) => {
          console.log(error)
        }
      )
    },
    loadWorkPack() {
      this.$store.dispatch('beginLoading')
      firebase.database().ref('workpacks').child(this.checkId).once('value').then(
        (data) => {
          this.workpack = data.val()
          this.$store.dispatch('endLoading')
        },
        (error) => {
          console.log(error)
          this.$store.dispatch('endLoading')
        }
      )
    },
    getEOList() {
      firebase.database().ref('eo').once('value').then(
        (data) => {
          const obj = data.val()
          for (let key in obj) {
            this.eoList.push(Object.assign({}, obj[key], { id: key }))
          }
        },
        (error) => {
          console.log(error)
        }
      )
    },
    editItem(item) {
      this.itemIndex = this.workpack.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogEditItem = true
    },
    closeEditItem() {
      this.dialogEditItem = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.itemIndex = -1
      }, 300)
    },
    saveEditItem() {
      if (this.itemIndex > -1 && !this.editedItem.taskName.includes('VN ')) {
        let editedProps = {
          amsMH: this.editedItem.amsMH,
          macMH: this.editedItem.macMH,
          men: this.editedItem.men,
          hour: this.editedItem.hour,
          zoneDivision: this.editedItem.zoneDivision,
          remarks: this.editedItem.remarks,
          taskName: this.editedItem.taskName,
          taskTitle: this.editedItem.taskTitle,
          taskType: this.editedItem.taskType,
          zone: this.editedItem.zone
        }
        if (this.editedItem.taskID !== null && this.editedItem.taskID !== undefined) {
          // console.log('edit')
          let updates = {}
          updates['/amsA321/' + this.editedItem.taskID] = editedProps
          updates['/workpacks/' + this.checkId + '/' + this.itemIndex] = this.editedItem
          firebase.database().ref().update(updates).then(
            (data) => {
              Object.assign(this.workpack[this.itemIndex], editedProps)
            },
            (error) => {
              console.log('NewCheck - saveEditItem' + error)
          })
        } else {
          // console.log('new')
          firebase.database().ref('amsA321').push(this.editedItem).then(
            (data) => {
              // console.log(data.key)
              this.editedItem.taskID = data.key
            },
            (error) => {
              console.log('NewCheck - saveEditItem' + error)
            }
          )
          firebase.database().ref('workpacks/' + this.checkId + '/' + this.itemIndex).update(this.editedItem).then(
            (data) => {
              Object.assign(this.workpack[this.itemIndex], this.editedItem)
            },
            (error) => {
              console.log(error)
            }
          )
        }
      }
      this.closeEditItem()
    },
    linkItem(item) {
      this.itemIndex = this.workpack.indexOf(item)
      console.log(this.itemIndex)
      this.editedItem = Object.assign({}, item)
      this.linkedItem = Object.assign({}, item)
      this.dialogLinkItem = true
    },
    closeLinkItem() {
      this.dialogLinkItem = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.linkedItem = this.editedItem
        this.itemIndex = -1
      }, 300)
    },
    saveLinkItem() {
      if (this.itemIndex > -1) {
        let editedProps = {
          amsMH: this.linkedItem.amsMH,
          macMH: this.linkedItem.macMH,
          men: this.linkedItem.men,
          hour: this.linkedItem.hour,
          zoneDivision: this.linkedItem.zoneDivision,
          remarks: this.linkedItem.remarks
        }
        let updates = {}
        updates['/eo/' + this.linkedItem.id] = Object.assign({}, editedProps, { name: this.linkedItem.name })
        updates['/workpacks/' + this.checkId + '/' + this.itemIndex] = Object.assign({}, this.editedItem, editedProps, { taskID: this.linkedItem.id })
        firebase.database().ref().update(updates).then(
          (data) => {
            editedProps.taskID = this.linkedItem.id
            Object.assign(this.workpack[this.itemIndex], editedProps)
          },
          (error) => {
            console.log(error)
          }
        )
      }
      this.closeLinkItem()
    },
    addEO(e) {
      let found = this.eoList.find((item) => {
        return item['name'] === e.target.value
      })
      if (found === undefined) {
        let newEO = {
          name: e.target.value,
          amsMH: 0,
          macMH: 0,
          men: 0,
          hour: 0,
          zoneDivision: 'N/A',
          remarks: 'NIL'
        }
        this.eoList.push(newEO)
        firebase.database().ref('eo').push(newEO).then(
          (data) => {
            this.eoList[this.eoList.length - 1].id = data.key
          },
          (error) => {
            console.log(error)
          }
        )
      }
    }
  },
  mounted() {
    this.checkId = this.$route.params.id
    this.loadCheck()
    this.loadWorkPack()
    this.getEOList()
  }
}
</script>