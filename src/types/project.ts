export interface Sheet {
  id: number
  project: number
  project_str: string
  created: string
  name: string
  is_active: boolean
  user: number
}

export interface Project {
  id: number
  status: number
  status_detail: StatusDetail
  created: string
  name: string
  description: string
  start_date: string
  end_date: string
  image: string
  file: string
  user: number
  team_members: number[]
}

export interface StatusDetail {
  id: number
  created: string
  name: string
  color: string
  user: number
}