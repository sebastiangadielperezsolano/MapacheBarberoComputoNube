package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tecnm.equipo4.barberoApi.models.Cliente;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByEmailAndPassword(String email, String password);
}