<?php

namespace App\Policies;

use App\User;
use App\Job;
use Illuminate\Auth\Access\HandlesAuthorization;

class JobPolicy
{
    use HandlesAuthorization;

    public function viewAny(?User $user): bool
    {
        return true; // Anyone can view jobs
    }

    public function view(?User $user, Job $job): bool
    {
        return $job->status === 'active' || ($user && $this->owns($user, $job));
    }

    public function create(User $user): bool
    {
        return $user->user_type === 'employer';
    }

    public function update(User $user, Job $job): bool
    {
        return $this->owns($user, $job);
    }

    public function delete(User $user, Job $job): bool
    {
        return $this->owns($user, $job);
    }

    public function apply(User $user, Job $job): bool
    {
        return $user->user_type === 'candidate' &&
               $job->status === 'active' &&
               !$job->is_expired &&
               !$job->applications()->where('user_id', $user->id)->exists();
    }

    public function save(User $user, Job $job): bool
    {
        return $user->user_type === 'candidate' && $job->status === 'active';
    }

    private function owns(User $user, Job $job): bool
    {
        return $job->company && $job->company->user_id === $user->id;
    }
}
