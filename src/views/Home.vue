<template>
  <div class="mt-3 w-100 h-100 container fluid">
    <br />
    <div class="row mb-3">
      <div class="col-lg-8 col-12">
        <strong>Our menu</strong>
        <div class="d-flex justify-content-start my-4">
          <div v-for="list in listManu" :key="list" class="bg-food mr-2" :class="statusFilter === list.value ? 'bg-orange' : 'bg-white'" @click="filter(list.value, list.filter)">
            <div class="icon-food">
              <i class='ml-2 mt-2' :class="list.icon" style='font-size:24px'></i>
            </div>
            <div class="mt-2">
              <center><span class="text-food-name">{{ list.name }}</span></center>
            </div>
          </div>
        </div>
        <div class="row mx-1">
          <div v-for="item in dataFoodsFilter" :key="item" class="p-relative mr-4 mt-2">
          <div class="card " style="width: 13rem;">
            <div class="sizeStyle">
              <img class="card-img-top imgStyle" :src="item.image" alt="Card image cap">
            </div>
            <div class="card-body">
              <div class="">{{ item.name }}</div>
              <small class="card-text text-muted">{{ item.description }}</small>
              <div class="mt-2">
                <button class="btn btn-primary w-100" @click="addCart(item)">+ {{ item.price }}</button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <div class="col-lg-4 col-12">
        <div class="bg-beige p-2">
          <strong>My Order</strong>
          <div v-for="item in cartData" :key="item" class="row mt-2">
            <div class="col-3 mt-1">
              <img :src="item.image" style="width: 60px">
            </div>
            <div class="col-9">
              <div class="row">
                <div class="col-8">
                  {{ item.name }}
                </div>
                <div class="col-4 text-right">
                  ${{ item.price }}
                </div>
              </div>
              <div>
                <i class="fa fa-minus iconMinusPlus cursor-pointer" @click="minusCart(item)"></i>
                {{ item.amount }}
                <i class="fa fa-plus iconMinusPlus cursor-pointer"  @click="addCart(item)"></i>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col">
              TOTAL:
            </div>
            <div class="col text-right">
              <!-- $ {{ formatTotalPrice }} -->
              {{ Number.parseFloat(this.totalPrice).toFixed(2) }}
            </div>
          </div>
          <hr>
          <div>
          <button class="btn btn-warning w-100" :disabled="disabledCheckout" @click="checkout()">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Axios from 'axios'
import moment from 'moment'

export default {
  data () {
    return {
      editIndex: -1,
      name: '',
      price: 0,
      mongo_api: 'https://5d9af632686ed000144d199a.mockapi.io/',
      statusFilter: 'all',
      dataFoods: [],
      dataFoodsFilter: [],
      listManu: {
        all: {
          icon: 'fas fa-utensils',
          name: 'All',
          value: 'all',
          filter: 'all'
        },
        pizza: {
          icon: 'fas fa-pizza-slice',
          name: 'Pizza',
          value: 'pizza',
          filter: 'pizza'
        },
        burgur: {
          icon: 'fas fa-hamburger',
          name: 'Burgur',
          value: 'burgur',
          filter: 'hamburger'
        },
        iceCream: {
          icon: 'fas fa-ice-cream',
          name: 'Ice Cream',
          value: 'iceCream',
          filter: 'ice cream'
        }
      },
      cartData: [],
      totalPrice: 0,
      date: null
    }
  },
  computed: {
    disabledCheckout () {
      return !this.cartData.length > 0
    }
  },
  created () {
    this.fetchFood()
  },
  methods: {
    async fetchFood () {
      // this.$store.dispatch('fetchFood')
      await Axios.get(this.mongo_api + 'menu')
        .then((r) => {
          this.dataFoods = r.data
          this.dataFoodsFilter = r.data
        })
        .catch(err => alert(err))
    },
    filter (value, filter) {
      this.statusFilter = value
      if (filter === 'all') {
        this.dataFoodsFilter = this.dataFoods
      } else {
        this.dataFoodsFilter = this.dataFoods.filter(x => {
          return x.category.trim() === filter.trim()
        })
      }
    },
    addCart (item) {
      let checkProductRepeatedly = false
      checkProductRepeatedly = this.cartData.some(x => {
        return x.id.trim() === item.id.trim()
      })
      if (!checkProductRepeatedly) {
        this.cartData.push({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          amount: 1,
          total: item.price
        })
      } else if (checkProductRepeatedly) {
        for (let i in this.cartData) {
          if (this.cartData[i].id === item.id) {
            this.cartData[i].amount = this.cartData[i].amount + 1
          }
        }
      }
      this.calculateTotalPrice()
    },
    minusCart (item) {
      // alert('sss')
      for (let i in this.cartData) {
        if (this.cartData[i].id === item.id) {
          if (this.cartData[i].amount < 2) {
            // this.calculateTotalPrice()
            this.cartData.splice(i, 1)
          } else {
            this.cartData[i].amount = this.cartData[i].amount - 1
          }
        }
      }
      this.calculateTotalPrice()
    },
    calculateTotalPrice () {
      let totalCurrentPrice = 0
      for (let i in this.cartData) {
        this.cartData[i].total = this.cartData[i].amount * this.cartData[i].price
        totalCurrentPrice = totalCurrentPrice + this.cartData[i].total
      }
      this.totalPrice = totalCurrentPrice
    },
    async checkout () {
      const cartItems = []
      this.cartData.map((item) => {
        cartItems.push({
          id: item.id,
          amount: item.amount
        })
      })
      let payload = {
        name: 'Pipusana Kumvongdee',
        createdAt: moment().format('DD/MM-YYYY, h:mm:ss'),
        totalPrice: this.totalPrice,
        cartItems
      }
      await Axios.post(this.mongo_api + 'order', payload)
        .then((r) => {
          alert('Order Success')
          this.fetchFood()
          this.cartData = []
          this.totalPrice = 0
        })
        .catch(err => alert(err))
    }
  }
}
</script>

<style>
.bg-red {
  background: red;
}
.sizeStyle {
  width: 207px;
  height: 180px;
  background: #F8EAEF;
}
.imgStyle {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.bg-beige {
  background: #FDEFEF;
}
.iconMinusPlus {
  border-radius: 10px;
  color: white;
  background: #296DDE;
  padding: 3px;
}
.text-white{
  color: white;
}
.bg-food {
  width: 60px;
  height: 100px;
  border-radius: 40px;
  border: 1px solid #F2F4F9;
  cursor: pointer;
  /* background: red; */
}
.icon-food {
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background: white;
  margin-left: 10px;
  margin-top: 11px;
  border: 1px solid #F2F4F9;
}
.bg-orange {
  background: orange;
}
.bg-white {
  background: white;
}
.text-food-name {
  font-size: 10px;
  font-weight: 600;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
