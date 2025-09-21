import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';

export const AssignmentManagement = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
          <p className="text-gray-600">Course ID: {id}</p>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Assignment management functionality will be implemented here.</p>
          <Button className="mt-4">Create Assignment</Button>
        </CardContent>
      </Card>
    </div>
  );
};
