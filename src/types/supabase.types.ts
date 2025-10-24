export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5'
  }
  public: {
    Tables: {
      appointment_types: {
        Row: {
          color: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          tenant_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'appointment_types_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      appointments: {
        Row: {
          appointment_type_id: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          pet_id: string
          reason: string | null
          scheduled_end: string
          scheduled_start: string
          status: Database['public']['Enums']['appointment_status']
          tenant_id: string
          updated_at: string
          updated_by: string | null
          veterinarian_id: string | null
        }
        Insert: {
          appointment_type_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          pet_id: string
          reason?: string | null
          scheduled_end: string
          scheduled_start: string
          status?: Database['public']['Enums']['appointment_status']
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
          veterinarian_id?: string | null
        }
        Update: {
          appointment_type_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          pet_id?: string
          reason?: string | null
          scheduled_end?: string
          scheduled_start?: string
          status?: Database['public']['Enums']['appointment_status']
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
          veterinarian_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'appointments_appointment_type_id_fkey'
            columns: ['appointment_type_id']
            isOneToOne: false
            referencedRelation: 'appointment_types'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'appointments_pet_id_fkey'
            columns: ['pet_id']
            isOneToOne: false
            referencedRelation: 'pets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'appointments_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'appointments_veterinarian_id_fkey'
            columns: ['veterinarian_id']
            isOneToOne: false
            referencedRelation: 'staff'
            referencedColumns: ['id']
          },
        ]
      }
      boardings: {
        Row: {
          check_in_at: string
          check_out_at: string | null
          daily_rate: number | null
          feeding_notes: string | null
          id: string
          kennel_id: string | null
          observations: string | null
          tenant_id: string
          treatment_id: string
        }
        Insert: {
          check_in_at: string
          check_out_at?: string | null
          daily_rate?: number | null
          feeding_notes?: string | null
          id?: string
          kennel_id?: string | null
          observations?: string | null
          tenant_id: string
          treatment_id: string
        }
        Update: {
          check_in_at?: string
          check_out_at?: string | null
          daily_rate?: number | null
          feeding_notes?: string | null
          id?: string
          kennel_id?: string | null
          observations?: string | null
          tenant_id?: string
          treatment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'boardings_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      breeds: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          species_id: string
          tenant_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          species_id: string
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          species_id?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'breeds_species_id_fkey'
            columns: ['species_id']
            isOneToOne: false
            referencedRelation: 'species'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'breeds_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      clinical_notes: {
        Row: {
          clinical_record_id: string
          created_at: string
          created_by: string | null
          id: string
          note: string
          pet_id: string
          tenant_id: string
          updated_at: string | null
          updated_by: string | null
          vet_id: string | null
        }
        Insert: {
          clinical_record_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          note: string
          pet_id: string
          tenant_id: string
          updated_at?: string | null
          updated_by?: string | null
          vet_id?: string | null
        }
        Update: {
          clinical_record_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string
          pet_id?: string
          tenant_id?: string
          updated_at?: string | null
          updated_by?: string | null
          vet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'clinical_notes_clinical_record_id_fkey'
            columns: ['clinical_record_id']
            isOneToOne: false
            referencedRelation: 'clinical_records'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clinical_notes_pet_id_fkey'
            columns: ['pet_id']
            isOneToOne: false
            referencedRelation: 'pets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clinical_notes_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clinical_notes_vet_id_fkey'
            columns: ['vet_id']
            isOneToOne: false
            referencedRelation: 'staff'
            referencedColumns: ['id']
          },
        ]
      }
      clinical_parameters: {
        Row: {
          clinical_record_id: string
          created_at: string
          created_by: string | null
          id: string
          measured_at: string
          params: Json
          pet_id: string
          schema_version: number
          tenant_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          clinical_record_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          measured_at?: string
          params: Json
          pet_id: string
          schema_version?: number
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          clinical_record_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          measured_at?: string
          params?: Json
          pet_id?: string
          schema_version?: number
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'clinical_parameters_pet_id_fkey'
            columns: ['pet_id']
            isOneToOne: false
            referencedRelation: 'pets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clinical_parameters_record_id_fkey'
            columns: ['clinical_record_id']
            isOneToOne: false
            referencedRelation: 'clinical_records'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clinical_parameters_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      clinical_records: {
        Row: {
          appointment_id: string | null
          created_at: string
          created_by: string | null
          diagnosis: string | null
          id: string
          notes: string | null
          pet_id: string
          reason: string | null
          record_date: string
          record_type: Database['public']['Enums']['record_type']
          tenant_id: string
          updated_at: string
          updated_by: string | null
          vet_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          id?: string
          notes?: string | null
          pet_id: string
          reason?: string | null
          record_date?: string
          record_type: Database['public']['Enums']['record_type']
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
          vet_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          id?: string
          notes?: string | null
          pet_id?: string
          reason?: string | null
          record_date?: string
          record_type?: Database['public']['Enums']['record_type']
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
          vet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'clinical_records_appointment_id_fkey'
            columns: ['appointment_id']
            isOneToOne: false
            referencedRelation: 'appointments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clinical_records_pet_id_fkey'
            columns: ['pet_id']
            isOneToOne: false
            referencedRelation: 'pets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clinical_records_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clinical_records_vet_id_fkey'
            columns: ['vet_id']
            isOneToOne: false
            referencedRelation: 'staff'
            referencedColumns: ['id']
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          created_by: string | null
          doc_id: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          tenant_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          doc_id: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          doc_id?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'clients_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      hospitalizations: {
        Row: {
          admission_at: string
          bed_id: string | null
          daily_rate: number | null
          discharge_at: string | null
          id: string
          notes: string | null
          pet_id: string
          tenant_id: string
        }
        Insert: {
          admission_at: string
          bed_id?: string | null
          daily_rate?: number | null
          discharge_at?: string | null
          id?: string
          notes?: string | null
          pet_id: string
          tenant_id: string
        }
        Update: {
          admission_at?: string
          bed_id?: string | null
          daily_rate?: number | null
          discharge_at?: string | null
          id?: string
          notes?: string | null
          pet_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'hospitalizations_pet_id_fkey'
            columns: ['pet_id']
            isOneToOne: false
            referencedRelation: 'pets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'hospitalizations_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          description: string
          discount: number
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          tax_rate: number
          tenant_id: string
          total: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          discount?: number
          id?: string
          order_id: string
          product_id?: string | null
          quantity: number
          tax_rate?: number
          tenant_id: string
          total?: number | null
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          discount?: number
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          tax_rate?: number
          tenant_id?: string
          total?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          balance: number | null
          created_at: string
          created_by: string | null
          currency: string
          custumer_id: string
          id: string
          notes: string | null
          order_number: string | null
          paid_amount: number
          pet_id: string | null
          status: Database['public']['Enums']['order_status']
          subtotal: number
          tax: number
          tenant_id: string
          total: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string
          custumer_id: string
          id?: string
          notes?: string | null
          order_number?: string | null
          paid_amount?: number
          pet_id?: string | null
          status?: Database['public']['Enums']['order_status']
          subtotal?: number
          tax?: number
          tenant_id: string
          total?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string
          custumer_id?: string
          id?: string
          notes?: string | null
          order_number?: string | null
          paid_amount?: number
          pet_id?: string | null
          status?: Database['public']['Enums']['order_status']
          subtotal?: number
          tax?: number
          tenant_id?: string
          total?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'orders_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_custumer_id_fkey'
            columns: ['custumer_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_pet_id_fkey'
            columns: ['pet_id']
            isOneToOne: false
            referencedRelation: 'pets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      payment_methods: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          name: string
          payment_type: Database['public']['Enums']['payment_type']
          sort_order: number | null
          tenant_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          name: string
          payment_type: Database['public']['Enums']['payment_type']
          sort_order?: number | null
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          name?: string
          payment_type?: Database['public']['Enums']['payment_type']
          sort_order?: number | null
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'payment_methods_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payment_methods_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payment_methods_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          customer_id: string
          id: string
          notes: string | null
          order_id: string | null
          payment_date: string
          payment_method_id: string
          reference: string | null
          tenant_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          customer_id: string
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_date?: string
          payment_method_id: string
          reference?: string | null
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          customer_id?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_date?: string
          payment_method_id?: string
          reference?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'payments_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payments_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payments_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payments_payment_method_id_fkey'
            columns: ['payment_method_id']
            isOneToOne: false
            referencedRelation: 'payment_methods'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payments_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payments_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      pets: {
        Row: {
          birth_date: string | null
          breed_id: string | null
          client_id: string
          color: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          microchip: string | null
          name: string
          notes: string | null
          sex: Database['public']['Enums']['pet_sex']
          species_id: string
          tenant_id: string
          updated_at: string
          updated_by: string | null
          weight: number | null
        }
        Insert: {
          birth_date?: string | null
          breed_id?: string | null
          client_id: string
          color?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          microchip?: string | null
          name: string
          notes?: string | null
          sex: Database['public']['Enums']['pet_sex']
          species_id?: string
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
          weight?: number | null
        }
        Update: {
          birth_date?: string | null
          breed_id?: string | null
          client_id?: string
          color?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          microchip?: string | null
          name?: string
          notes?: string | null
          sex?: Database['public']['Enums']['pet_sex']
          species_id?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'pets_breed_id_fkey'
            columns: ['breed_id']
            isOneToOne: false
            referencedRelation: 'breeds'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pets_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pets_species_id_fkey'
            columns: ['species_id']
            isOneToOne: false
            referencedRelation: 'species'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'pets_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      product_brands: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          tenant_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'product_brands_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          tenant_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'product_categories_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      product_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          product_id: string
          quantity: number
          reference: string | null
          related_id: string | null
          source: string | null
          tenant_id: string
          unit_cost: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          product_id: string
          quantity: number
          reference?: string | null
          related_id?: string | null
          source?: string | null
          tenant_id: string
          unit_cost?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          product_id?: string
          quantity?: number
          reference?: string | null
          related_id?: string | null
          source?: string | null
          tenant_id?: string
          unit_cost?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'product_movements_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_movements_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      product_units: {
        Row: {
          abbreviation: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          name: string
          tenant_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          abbreviation?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          name: string
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          abbreviation?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          name?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'product_units_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          batch_number: string | null
          brand_id: string | null
          category_id: string | null
          cost: number | null
          created_at: string
          created_by: string | null
          expiry_date: string | null
          id: string
          is_active: boolean
          is_service: boolean
          name: string
          notes: string | null
          price: number
          sku: string | null
          stock: number
          tax_rate: number | null
          tenant_id: string
          unit_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          barcode?: string | null
          batch_number?: string | null
          brand_id?: string | null
          category_id?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          is_service?: boolean
          name: string
          notes?: string | null
          price?: number
          sku?: string | null
          stock?: number
          tax_rate?: number | null
          tenant_id: string
          unit_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          barcode?: string | null
          batch_number?: string | null
          brand_id?: string | null
          category_id?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          is_service?: boolean
          name?: string
          notes?: string | null
          price?: number
          sku?: string | null
          stock?: number
          tax_rate?: number | null
          tenant_id?: string
          unit_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'products_brand_id_fkey'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'product_brands'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'product_categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'products_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'products_unit_id_fkey'
            columns: ['unit_id']
            isOneToOne: false
            referencedRelation: 'product_units'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          address: Json | null
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      record_items: {
        Row: {
          created_at: string
          created_by: string | null
          discount: number | null
          id: string
          notes: string | null
          product_id: string
          qty: number
          record_id: string
          tenant_id: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          discount?: number | null
          id?: string
          notes?: string | null
          product_id: string
          qty: number
          record_id: string
          tenant_id: string
          unit_price: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          discount?: number | null
          id?: string
          notes?: string | null
          product_id?: string
          qty?: number
          record_id?: string
          tenant_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: 'record_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'record_items_record_id_fkey'
            columns: ['record_id']
            isOneToOne: false
            referencedRelation: 'clinical_records'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'record_items_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      specialties: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          tenant_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'specialties_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      species: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          tenant_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'species_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      staff: {
        Row: {
          created_at: string
          created_by: string | null
          email: string | null
          first_name: string
          id: string
          is_active: boolean
          last_name: string | null
          license_number: string | null
          phone: string | null
          tenant_id: string
          updated_at: string
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name: string
          id?: string
          is_active?: boolean
          last_name?: string | null
          license_number?: string | null
          phone?: string | null
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string | null
          license_number?: string | null
          phone?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'staff_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      staff_specialties: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          specialty_id: string
          staff_id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          specialty_id: string
          staff_id: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          specialty_id?: string
          staff_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'staff_specialties_specialty_id_fkey'
            columns: ['specialty_id']
            isOneToOne: false
            referencedRelation: 'specialties'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'staff_specialties_staff_id_fkey'
            columns: ['staff_id']
            isOneToOne: false
            referencedRelation: 'staff'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'staff_specialties_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      supplier_brands: {
        Row: {
          brand_id: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          is_primary: boolean
          notes: string | null
          supplier_id: string
          tenant_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_primary?: boolean
          notes?: string | null
          supplier_id: string
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_primary?: boolean
          notes?: string | null
          supplier_id?: string
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'supplier_brands_brand_id_fkey'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'product_brands'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'supplier_brands_supplier_id_fkey'
            columns: ['supplier_id']
            isOneToOne: false
            referencedRelation: 'suppliers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'supplier_brands_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          created_by: string | null
          document_number: string | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          phone: string | null
          tenant_id: string
          updated_at: string
          updated_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          document_number?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          phone?: string | null
          tenant_id: string
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          document_number?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'suppliers_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      surgeries: {
        Row: {
          complications: string | null
          duration_min: number | null
          id: string
          surgeon_notes: string | null
          tenant_id: string
          treatment_id: string
        }
        Insert: {
          complications?: string | null
          duration_min?: number | null
          id?: string
          surgeon_notes?: string | null
          tenant_id: string
          treatment_id: string
        }
        Update: {
          complications?: string | null
          duration_min?: number | null
          id?: string
          surgeon_notes?: string | null
          tenant_id?: string
          treatment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'surgeries_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      tenant_counters: {
        Row: {
          counter_key: string
          last_number: number
          tenant_id: string
          updated_at: string
        }
        Insert: {
          counter_key: string
          last_number?: number
          tenant_id: string
          updated_at?: string
        }
        Update: {
          counter_key?: string
          last_number?: number
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tenant_counters_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
      tenant_users: {
        Row: {
          created_at: string
          created_by: string
          invited_at: string | null
          is_active: boolean
          tenant_id: string
          updated_at: string
          updated_by: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          invited_at?: string | null
          is_active?: boolean
          tenant_id: string
          updated_at?: string
          updated_by?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          invited_at?: string | null
          is_active?: boolean
          tenant_id?: string
          updated_at?: string
          updated_by?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tenant_users_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tenant_users_user_id_fkey1'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      tenants: {
        Row: {
          address: Json | null
          business_hours: Json | null
          created_at: string
          created_by: string
          currency: string | null
          email: string | null
          id: string
          is_active: boolean
          legal_name: string | null
          name: string
          owner_id: string
          phone: string | null
          subdomain: string | null
          tax_id: string | null
          timezone: string | null
          updated_at: string
          updated_by: string
        }
        Insert: {
          address?: Json | null
          business_hours?: Json | null
          created_at?: string
          created_by?: string
          currency?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          legal_name?: string | null
          name: string
          owner_id?: string
          phone?: string | null
          subdomain?: string | null
          tax_id?: string | null
          timezone?: string | null
          updated_at?: string
          updated_by?: string
        }
        Update: {
          address?: Json | null
          business_hours?: Json | null
          created_at?: string
          created_by?: string
          currency?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          legal_name?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          subdomain?: string | null
          tax_id?: string | null
          timezone?: string | null
          updated_at?: string
          updated_by?: string
        }
        Relationships: []
      }
      trainings: {
        Row: {
          goal: string | null
          id: string
          progress_notes: string | null
          sessions_completed: number | null
          sessions_planned: number | null
          tenant_id: string
          trainer_id: string | null
          treatment_id: string
        }
        Insert: {
          goal?: string | null
          id?: string
          progress_notes?: string | null
          sessions_completed?: number | null
          sessions_planned?: number | null
          tenant_id: string
          trainer_id?: string | null
          treatment_id: string
        }
        Update: {
          goal?: string | null
          id?: string
          progress_notes?: string | null
          sessions_completed?: number | null
          sessions_planned?: number | null
          tenant_id?: string
          trainer_id?: string | null
          treatment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'trainings_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'trainings_trainer_id_fkey'
            columns: ['trainer_id']
            isOneToOne: false
            referencedRelation: 'staff'
            referencedColumns: ['id']
          },
        ]
      }
      vaccinations: {
        Row: {
          adverse_event: string | null
          clinical_record_id: string
          created_at: string
          created_by: string | null
          dose: string | null
          id: string
          next_due_at: string | null
          route: string | null
          site: string | null
          tenant_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          adverse_event?: string | null
          clinical_record_id: string
          created_at?: string
          created_by?: string | null
          dose?: string | null
          id?: string
          next_due_at?: string | null
          route?: string | null
          site?: string | null
          tenant_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          adverse_event?: string | null
          clinical_record_id?: string
          created_at?: string
          created_by?: string | null
          dose?: string | null
          id?: string
          next_due_at?: string | null
          route?: string | null
          site?: string | null
          tenant_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vaccinations_clinical_record_id_fkey'
            columns: ['clinical_record_id']
            isOneToOne: false
            referencedRelation: 'clinical_records'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vaccinations_tenant_id_fkey'
            columns: ['tenant_id']
            isOneToOne: false
            referencedRelation: 'tenants'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_triggers_for_all_tables: { Args: never; Returns: undefined }
    }
    Enums: {
      appointment_status:
        | 'scheduled'
        | 'confirmed'
        | 'in_progress'
        | 'completed'
        | 'cancelled'
        | 'no_show'
      order_status: 'draft' | 'confirmed' | 'paid' | 'cancelled' | 'refunded'
      payment_type: 'cash' | 'app' | 'credit' | 'others'
      pet_sex: 'M' | 'F'
      record_type:
        | 'consultation'
        | 'vaccination'
        | 'surgery'
        | 'hospitalization'
        | 'deworming'
      treatment_status: 'draft' | 'completed' | 'cancelled'
      treatment_type:
        | 'consultation'
        | 'vaccination'
        | 'surgery'
        | 'grooming'
        | 'hospitalization'
        | 'deworming'
        | 'boarding'
        | 'training'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        'scheduled',
        'confirmed',
        'in_progress',
        'completed',
        'cancelled',
        'no_show',
      ],
      order_status: ['draft', 'confirmed', 'paid', 'cancelled', 'refunded'],
      payment_type: ['cash', 'app', 'credit', 'others'],
      pet_sex: ['M', 'F'],
      record_type: [
        'consultation',
        'vaccination',
        'surgery',
        'hospitalization',
        'deworming',
      ],
      treatment_status: ['draft', 'completed', 'cancelled'],
      treatment_type: [
        'consultation',
        'vaccination',
        'surgery',
        'grooming',
        'hospitalization',
        'deworming',
        'boarding',
        'training',
      ],
    },
  },
} as const
