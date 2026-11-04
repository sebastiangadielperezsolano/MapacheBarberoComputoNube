package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tecnm.equipo4.barberoApi.models.Barbero;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarberoRepository extends JpaRepository<Barbero, Long> {
    Optional<Barbero> findFirstByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    List<Barbero> findBySucursal_IdSucursal(Long idSucursal);
}