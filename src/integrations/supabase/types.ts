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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string | null
          employee_id: string
          id: string
          month: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          employee_id: string
          id?: string
          month: string
          title?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          employee_id?: string
          id?: string
          month?: string
          title?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          body: string
          created_at: string
          id: string
          posted_at: string
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          posted_at?: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          posted_at?: string
          title?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          created_at: string
          date: string
          employee_id: string
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          created_at?: string
          date: string
          employee_id: string
          id?: string
          notes?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          created_at: string
          email: string | null
          id: string
          joining_date: string | null
          mobile: string
          name: string
          notes: string | null
          position: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          joining_date?: string | null
          mobile: string
          name: string
          notes?: string | null
          position?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          joining_date?: string | null
          mobile?: string
          name?: string
          notes?: string | null
          position?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      employee_documents: {
        Row: {
          created_at: string
          doc_type: string
          doc_url: string | null
          employee_id: string
          id: string
          notes: string | null
        }
        Insert: {
          created_at?: string
          doc_type: string
          doc_url?: string | null
          employee_id: string
          id?: string
          notes?: string | null
        }
        Update: {
          created_at?: string
          doc_type?: string
          doc_url?: string | null
          employee_id?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          employee_id: string
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          employee_id: string
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          employee_id?: string
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          about: string | null
          active: boolean
          avatar_url: string | null
          base_salary: number
          created_at: string
          department: string | null
          dob: string | null
          email: string | null
          id: string
          joining_date: string | null
          mobile: string
          monthly_target: number
          name: string
          role: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          about?: string | null
          active?: boolean
          avatar_url?: string | null
          base_salary?: number
          created_at?: string
          department?: string | null
          dob?: string | null
          email?: string | null
          id?: string
          joining_date?: string | null
          mobile: string
          monthly_target?: number
          name: string
          role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          about?: string | null
          active?: boolean
          avatar_url?: string | null
          base_salary?: number
          created_at?: string
          department?: string | null
          dob?: string | null
          email?: string | null
          id?: string
          joining_date?: string | null
          mobile?: string
          monthly_target?: number
          name?: string
          role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      holidays: {
        Row: {
          created_at: string
          date: string
          id: string
          name: string
          notes: string | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          name: string
          notes?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          name?: string
          notes?: string | null
        }
        Relationships: []
      }
      interviews: {
        Row: {
          candidate_id: string | null
          candidate_name: string
          created_at: string
          id: string
          interviewer: string | null
          mode: string | null
          notes: string | null
          result: string
          scheduled_at: string
          updated_at: string
        }
        Insert: {
          candidate_id?: string | null
          candidate_name: string
          created_at?: string
          id?: string
          interviewer?: string | null
          mode?: string | null
          notes?: string | null
          result?: string
          scheduled_at: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string | null
          candidate_name?: string
          created_at?: string
          id?: string
          interviewer?: string | null
          mode?: string | null
          notes?: string | null
          result?: string
          scheduled_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          budget: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          project_type: string | null
          service_category: string | null
          source_page: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          project_type?: string | null
          service_category?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          project_type?: string | null
          service_category?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      leaves: {
        Row: {
          created_at: string
          days: number
          employee_id: string
          from_date: string
          id: string
          leave_type: string
          reason: string | null
          status: string
          to_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          days?: number
          employee_id: string
          from_date: string
          id?: string
          leave_type?: string
          reason?: string | null
          status?: string
          to_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          days?: number
          employee_id?: string
          from_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          status?: string
          to_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaves_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      salaries: {
        Row: {
          base: number
          bonus: number
          created_at: string
          deduction: number
          employee_id: string
          id: string
          month: string
          net: number
          notes: string | null
          paid: boolean
          paid_at: string | null
          updated_at: string
        }
        Insert: {
          base?: number
          bonus?: number
          created_at?: string
          deduction?: number
          employee_id: string
          id?: string
          month: string
          net?: number
          notes?: string | null
          paid?: boolean
          paid_at?: string | null
          updated_at?: string
        }
        Update: {
          base?: number
          bonus?: number
          created_at?: string
          deduction?: number
          employee_id?: string
          id?: string
          month?: string
          net?: number
          notes?: string | null
          paid?: boolean
          paid_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salaries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          address: string
          email: string
          id: string
          phone: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string
          email?: string
          id?: string
          phone?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string
          email?: string
          id?: string
          phone?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      time_logs: {
        Row: {
          created_at: string
          employee_id: string
          event_at: string
          event_type: string
          id: string
          notes: string | null
        }
        Insert: {
          created_at?: string
          employee_id: string
          event_at?: string
          event_type: string
          id?: string
          notes?: string | null
        }
        Update: {
          created_at?: string
          employee_id?: string
          event_at?: string
          event_type?: string
          id?: string
          notes?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      work_logs: {
        Row: {
          created_at: string
          customers_handled: number
          employee_id: string
          id: string
          log_date: string
          notes: string | null
          tasks_completed: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customers_handled?: number
          employee_id: string
          id?: string
          log_date?: string
          notes?: string | null
          tasks_completed?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customers_handled?: number
          employee_id?: string
          id?: string
          log_date?: string
          notes?: string | null
          tasks_completed?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_employee_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_email: { Args: { _email: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "employee"],
    },
  },
} as const
